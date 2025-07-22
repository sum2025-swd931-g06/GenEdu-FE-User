import React from 'react'
import { Modal, Button } from 'antd'
import { PresentationTemplate } from './templateConstants'
import { TypedSlideData } from '../../types/slideStream.type'
import StyledRevealPresentation from './StyledRevealPresentation'

interface TemplatePreviewModalProps {
  template: PresentationTemplate | null
  visible: boolean
  onClose: () => void
  sampleSlides: TypedSlideData[]
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, visible, onClose, sampleSlides }) => {
  if (!template) return null

  return (
    <Modal
      title={`Preview: ${template.name}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>
      ]}
      width='90vw'
      style={{ top: 20 }}
      bodyStyle={{ height: '80vh', padding: 0 }}
    >
      <StyledRevealPresentation slides={sampleSlides} template={template} height='80vh' size='large' />
    </Modal>
  )
}

export default TemplatePreviewModal
