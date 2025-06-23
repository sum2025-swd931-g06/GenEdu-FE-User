# GenEdu Frontend API Specification

## Overview

This document defines the API endpoints and data contracts expected by the GenEdu Frontend User application. The backend should implement these endpoints to ensure seamless integration.

## Base Configuration

- **Base URL**: `https://api.genedu.com/v1`
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **Response Format**: JSON

## Authentication

### 1. User Authentication

#### POST `/auth/login`

**Description**: Authenticate user and return access token

**Request Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "username": "string",
      "avatar": "string|null"
    }
  }
}
```

#### POST `/auth/refresh`

**Description**: Refresh access token

**Request Body**:

```json
{
  "refreshToken": "string"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

#### POST `/auth/logout`

**Description**: Logout user and invalidate tokens

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2. User Registration

#### POST `/auth/register`

**Description**: Register new user account

**Request Body**:

```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "username": "string"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "username": "string"
    }
  }
}
```

## User Management

### 3. Get Current User Profile

#### GET `/users/me`

**Description**: Get current authenticated user profile

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "username": "string",
    "avatar": "string|null",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

### 4. Update User Profile

#### PUT `/users/me`

**Description**: Update current user profile

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "fullName": "string",
  "username": "string",
  "avatar": "string|null"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "username": "string",
    "avatar": "string|null"
  }
}
```

## Projects

### 5. Get User Projects

#### GET `/projects`

**Description**: Get all projects for the authenticated user

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:

- `status` (optional): `DRAFT|IN_PROGRESS|COMPLETED`
- `page` (optional): integer (default: 1)
- `limit` (optional): integer (default: 10)
- `search` (optional): string

**Response**:

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "string",
        "title": "string",
        "status": "DRAFT|IN_PROGRESS|COMPLETED",
        "creationTime": "timestamp",
        "slideNum": "integer",
        "audioProject": {
          "id": "string",
          "title": "string",
          "status": "DRAFT|PROCESSING|COMPLETED",
          "creationTime": "timestamp",
          "durationSeconds": "integer|null",
          "audioUrl": "string|null",
          "voiceType": "string"
        }
      }
    ],
    "pagination": {
      "page": "integer",
      "limit": "integer",
      "total": "integer",
      "totalPages": "integer"
    }
  }
}
```

### 6. Create New Project

#### POST `/projects`

**Description**: Create a new project

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "title": "string",
  "topic": "string"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "DRAFT",
    "creationTime": "timestamp",
    "slideNum": 0,
    "audioProject": null
  }
}
```

### 7. Get Project Details

#### GET `/projects/{projectId}`

**Description**: Get detailed project information including slides

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "DRAFT|IN_PROGRESS|COMPLETED",
    "creationTime": "timestamp",
    "slideNum": "integer",
    "audioProject": {
      "id": "string",
      "title": "string",
      "status": "DRAFT|PROCESSING|COMPLETED",
      "creationTime": "timestamp",
      "durationSeconds": "integer|null",
      "textContent": "string",
      "audioUrl": "string|null",
      "voiceType": "string"
    },
    "slides": [
      {
        "id": "string",
        "title": "string",
        "content": "string", // HTML content
        "order": "integer"
      }
    ]
  }
}
```

### 8. Update Project

#### PUT `/projects/{projectId}`

**Description**: Update project information

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "title": "string",
  "status": "DRAFT|IN_PROGRESS|COMPLETED"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "DRAFT|IN_PROGRESS|COMPLETED",
    "creationTime": "timestamp",
    "slideNum": "integer"
  }
}
```

### 9. Delete Project

#### DELETE `/projects/{projectId}`

**Description**: Delete a project

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## AI Slide Generation

### 10. Generate Slides

#### POST `/projects/{projectId}/generate-slides`

**Description**: Generate AI-powered slides for a project

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "topic": "string",
  "slideCount": "integer", // optional, default: 10
  "language": "string", // optional, default: "en"
  "style": "string" // optional: "professional|educational|creative"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "projectId": "string",
    "slides": [
      {
        "id": "string",
        "title": "string",
        "content": "string", // HTML content
        "order": "integer"
      }
    ],
    "generationTime": "timestamp"
  }
}
```

### 11. Regenerate Specific Slide

#### POST `/projects/{projectId}/slides/{slideId}/regenerate`

**Description**: Regenerate a specific slide with AI

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "prompt": "string", // optional additional instructions
  "style": "string" // optional: "professional|educational|creative"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string", // HTML content
    "order": "integer"
  }
}
```

## Audio Projects

### 12. Get Audio Projects

#### GET `/audio-projects`

**Description**: Get all audio projects for the authenticated user

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "status": "DRAFT|PROCESSING|COMPLETED",
      "creationTime": "timestamp",
      "durationSeconds": "integer|null",
      "textContent": "string",
      "audioUrl": "string|null",
      "voiceType": "string"
    }
  ]
}
```

### 13. Create Audio Narration

#### POST `/projects/{projectId}/audio`

**Description**: Generate audio narration for a project

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "textContent": "string",
  "voiceType": "string", // e.g., "Professional Male - David"
  "language": "string", // optional, default: "en"
  "speed": "number" // optional, default: 1.0, range: 0.5-2.0
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "PROCESSING",
    "creationTime": "timestamp",
    "textContent": "string",
    "voiceType": "string",
    "estimatedDuration": "integer"
  }
}
```

### 14. Get Audio Generation Status

#### GET `/audio-projects/{audioId}/status`

**Description**: Check the status of audio generation

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "DRAFT|PROCESSING|COMPLETED|FAILED",
    "progress": "integer", // 0-100
    "audioUrl": "string|null",
    "durationSeconds": "integer|null",
    "error": "string|null"
  }
}
```

## Project Export

### 15. Export Project

#### POST `/projects/{projectId}/export`

**Description**: Export project in various formats

**Headers**: `Authorization: Bearer {token}`

**Request Body**:

```json
{
  "format": "pdf|pptx|html",
  "includeAudio": "boolean", // optional, default: false
  "template": "string" // optional template name
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "exportId": "string",
    "status": "PROCESSING",
    "format": "pdf|pptx|html"
  }
}
```

### 16. Get Export Status

#### GET `/exports/{exportId}`

**Description**: Check export status and get download URL

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "PROCESSING|COMPLETED|FAILED",
    "downloadUrl": "string|null",
    "expiresAt": "ISO8601|null",
    "error": "string|null"
  }
}
```

## Analytics & Statistics

### 17. Get User Statistics

#### GET `/users/me/stats`

**Description**: Get user project statistics

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "success": true,
  "data": {
    "totalProjects": "integer",
    "completedProjects": "integer",
    "totalSlides": "integer",
    "totalAudioMinutes": "integer",
    "projectsByStatus": {
      "DRAFT": "integer",
      "IN_PROGRESS": "integer",
      "COMPLETED": "integer"
    }
  }
}
```

## File Upload

### 18. Upload File

#### POST `/upload`

**Description**: Upload files (images, documents, etc.)

**Headers**:

- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body**: FormData with file

**Response**:

```json
{
  "success": true,
  "data": {
    "fileId": "string",
    "filename": "string",
    "url": "string",
    "size": "integer",
    "mimeType": "string"
  }
}
```

## Search

### 19. Search Projects

#### GET `/search/projects`

**Description**: Search projects by title, content, or tags

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:

- `q`: string (required) - search query
- `page`: integer (optional, default: 1)
- `limit`: integer (optional, default: 10)

**Response**:

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "string",
        "title": "string",
        "status": "DRAFT|IN_PROGRESS|COMPLETED",
        "creationTime": "timestamp",
        "slideNum": "integer",
        "relevanceScore": "number"
      }
    ],
    "pagination": {
      "page": "integer",
      "limit": "integer",
      "total": "integer",
      "totalPages": "integer"
    }
  }
}
```

## Error Responses

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "string", // e.g., "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED"
    "message": "string", // Human-readable error message
    "details": "object|null" // Additional error details
  }
}
```

### Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `422`: Unprocessable Entity (business logic errors)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **AI Generation endpoints**: 10 requests per hour per user
- **General API endpoints**: 100 requests per minute per user
- **File upload**: 20 requests per hour per user

## WebSocket Events (Optional)

For real-time updates on audio generation and exports:

### Connection

- **URL**: `wss://api.genedu.com/ws`
- **Auth**: Send JWT token in connection query: `?token={jwt}`

### Events to Listen:

```json
{
  "type": "audio_generation_progress",
  "data": {
    "audioId": "string",
    "progress": "integer",
    "status": "PROCESSING|COMPLETED|FAILED"
  }
}
```

```json
{
  "type": "export_completed",
  "data": {
    "exportId": "string",
    "downloadUrl": "string",
    "format": "pdf|pptx|html"
  }
}
```

## Data Types Reference

### Project Status

- `DRAFT`: Project created but not started
- `IN_PROGRESS`: Project is being worked on
- `COMPLETED`: Project is finished

### Audio Project Status

- `DRAFT`: Audio project created but not processed
- `PROCESSING`: Audio is being generated
- `COMPLETED`: Audio generation finished
- `FAILED`: Audio generation failed

### Voice Types

- `Professional Male - David`
- `Professional Female - Sarah`
- `Professional Male - Alex`
- `Casual Female - Emma`
- `Casual Male - James`

## Implementation Notes

1. **Authentication**: Use JWT tokens with reasonable expiration times (15 minutes for access, 7 days for refresh)
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage) for audio files and exports
3. **AI Integration**: Integrate with AI services (OpenAI, Azure Cognitive Services) for content generation
4. **Database**: Use relational database (PostgreSQL) for structured data
5. **Caching**: Implement Redis caching for frequently accessed data
6. **Queue System**: Use job queues (Redis Queue, Celery) for long-running tasks like audio generation
7. **Monitoring**: Implement logging and monitoring for API performance and errors

This specification provides a complete contract for backend implementation that will seamlessly integrate with the GenEdu Frontend User application.
