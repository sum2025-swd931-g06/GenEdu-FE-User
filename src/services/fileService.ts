import { TypedSlideData } from '../types/slideStream.type'
import { PowerPointGenerator, PowerPointGenerationOptions } from '../utils/powerpointGenerator'

export interface GeneratedFile {
  id: string
  filename: string
  projectId: string
  type: 'powerpoint'
  size: number
  createdAt: string
  localPath?: string
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed'
  uploadUrl?: string
  serverUrl?: string
  uploadedAt?: string
  lectureContentId?: string
  presentationId?: string
}

export class FileService {
  private static readonly STORAGE_KEY = 'genedu_generated_files'
  
  /**
   * Generate PowerPoint file from slides and save to files directory
   */
  static async generateAndSavePowerPoint(
    slides: TypedSlideData[],
    projectId: string,
    options: PowerPointGenerationOptions
  ): Promise<GeneratedFile> {
    try {
      // Generate PowerPoint
      const generator = new PowerPointGenerator(options)
      generator.generateFromSlides(slides)
      
      // Get blob
      const blob = await generator.saveToBlob()
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const cleanTitle = options.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
      const filename = `${cleanTitle}_${timestamp}.pptx`
      
      // Save blob to files directory (simulate file system write)
      const localPath = `/files/${filename}`
      await this.saveBlobToLocalPath(blob, localPath)
      
      // Create file info
      const fileInfo: GeneratedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename,
        projectId,
        type: 'powerpoint',
        size: blob.size,
        createdAt: new Date().toISOString(),
        localPath,
        uploadStatus: 'pending'
      }
      
      // Save file info to localStorage
      this.saveFileInfo(fileInfo)
      
      // Also trigger download for user
      this.downloadBlob(blob, filename)
      
      return fileInfo
    } catch (error) {
      console.error('Error generating PowerPoint:', error)
      throw new Error('Failed to generate PowerPoint file')
    }
  }
  
  /**
   * Save blob to local files directory (simulated - in real app would use File System API)
   */
  private static async saveBlobToLocalPath(blob: Blob, localPath: string): Promise<void> {
    try {
      // In a real application, you would use File System Access API or save to a server
      // For now, we'll store the blob URL in sessionStorage for later access
      const blobUrl = URL.createObjectURL(blob)
      sessionStorage.setItem(`blob_${localPath}`, blobUrl)
      
      console.log(`File saved to: ${localPath} (Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB)`)
    } catch (error) {
      console.error('Error saving file to local path:', error)
      throw new Error('Failed to save file locally')
    }
  }
  
  /**
   * Load blob from local path
   */
  static async loadBlobFromLocalPath(localPath: string): Promise<Blob | null> {
    try {
      const blobUrl = sessionStorage.getItem(`blob_${localPath}`)
      if (!blobUrl) {
        return null
      }
      
      const response = await fetch(blobUrl)
      return await response.blob()
    } catch (error) {
      console.error('Error loading file from local path:', error)
      return null
    }
  }
  
  /**
   * Save file info to localStorage
   */
  private static saveFileInfo(fileInfo: GeneratedFile): void {
    try {
      const existingFiles = this.getFileInfoList()
      existingFiles.push(fileInfo)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingFiles))
    } catch (error) {
      console.error('Error saving file info:', error)
    }
  }
  
  /**
   * Get list of generated files from localStorage
   */
  static getFileInfoList(): GeneratedFile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading file info:', error)
      return []
    }
  }

  /**
   * Get all files (alias for getFileInfoList)
   */
  static getAllFiles(): GeneratedFile[] {
    return this.getFileInfoList()
  }

  /**
   * Get files for a specific project
   */
  static getFilesByProjectId(projectId: string): GeneratedFile[] {
    return this.getFileInfoList().filter(file => file.projectId === projectId)
  }
  
  /**
   * Download blob as file
   */
  static downloadBlob(blob: Blob, filename: string): void {
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading blob:', error)
      throw error
    }
  }

  /**
   * Upload file to server
   */
  static async uploadFileToServer(
    file: GeneratedFile,
    uploadUrl: string,
    authToken?: string
  ): Promise<GeneratedFile> {
    try {
      // Update status to uploading
      this.updateFileStatus(file.id, 'uploading')
      
      // Load blob from local storage
      const blob = await this.loadBlobFromLocalPath(file.localPath!)
      if (!blob) {
        throw new Error('Failed to load file blob')
      }
      
      // Create form data
      const formData = new FormData()
      formData.append('file', blob, file.filename)
      formData.append('projectId', file.projectId)
      formData.append('type', file.type)
      formData.append('originalName', file.filename)
      
      // Upload with progress tracking
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Update file info with upload success
      this.updateFileStatus(file.id, 'uploaded', result.url)
      
      // Return updated file
      const files = this.getFileInfoList()
      const updatedFile = files.find(f => f.id === file.id)
      if (!updatedFile) {
        throw new Error('Updated file not found')
      }
      
      return updatedFile
    } catch (error) {
      console.error('Upload error:', error)
      // Update status to failed
      this.updateFileStatus(file.id, 'failed')
      throw error
    }
  }
  
  /**
   * Update file upload status
   */
  static updateFileStatus(
    fileId: string, 
    status: GeneratedFile['uploadStatus'], 
    uploadUrl?: string
  ): void {
    try {
      const files = this.getFileInfoList()
      const fileIndex = files.findIndex(f => f.id === fileId)
      
      if (fileIndex >= 0) {
        files[fileIndex].uploadStatus = status
        if (uploadUrl) {
          files[fileIndex].uploadUrl = uploadUrl
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files))
      }
    } catch (error) {
      console.error('Error updating file status:', error)
    }
  }
  
  /**
   * Delete file info
   */
  static deleteFile(fileId: string): void {
    try {
      const files = this.getFileInfoList()
      const fileIndex = files.findIndex(f => f.id === fileId)
      
      if (fileIndex >= 0) {
        const file = files[fileIndex]
        
        // Clean up blob URL if exists
        if (file.localPath) {
          const blobUrl = sessionStorage.getItem(`blob_${file.localPath}`)
          if (blobUrl) {
            URL.revokeObjectURL(blobUrl)
            sessionStorage.removeItem(`blob_${file.localPath}`)
          }
        }
        
        // Remove from list
        files.splice(fileIndex, 1)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files))
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
  
  /**
   * Clear old files (cleanup utility)
   */
  static clearOldFiles(daysOld: number = 7): void {
    try {
      const files = this.getFileInfoList()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)
      
      const recentFiles = files.filter(file => {
        const fileDate = new Date(file.createdAt)
        const isRecent = fileDate > cutoffDate
        
        // Clean up old blob URLs
        if (!isRecent && file.localPath) {
          const blobUrl = sessionStorage.getItem(`blob_${file.localPath}`)
          if (blobUrl) {
            URL.revokeObjectURL(blobUrl)
            sessionStorage.removeItem(`blob_${file.localPath}`)
          }
        }
        
        return isRecent
      })
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentFiles))
    } catch (error) {
      console.error('Error clearing old files:', error)
    }
  }
}