# Custom Content Management Dashboard Implementation Plan

This document outlines the plan for building a custom content management dashboard for the Ancient History Trivia app, enabling non-technical users to create and manage trivia questions and bundles.

## Table of Contents

1. [Overview](#overview)
2. [Why Build a Custom Dashboard](#why-build-a-custom-dashboard)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Core Features](#core-features)
5. [Implementation Plan](#implementation-plan)
6. [Database Schema](#database-schema)
7. [User Interface Components](#user-interface-components)
8. [Integration with Existing System](#integration-with-existing-system)
9. [Cost Analysis](#cost-analysis)
10. [Security & Permissions](#security--permissions)
11. [Quality Assurance Features](#quality-assurance-features)
12. [Deployment Strategy](#deployment-strategy)
13. [Future Enhancements](#future-enhancements)

## Overview

The custom content management dashboard will provide a user-friendly interface for historians, educators, and content creators to manage trivia questions and bundles without requiring technical knowledge. This solution offers the benefits of a headless CMS while maintaining full control over features, costs, and integration with the existing system.

### Key Benefits

- **Tailored Interface**: Designed specifically for trivia questions and educational content
- **Cost Effective**: No monthly CMS fees, just hosting costs
- **Full Control**: Complete customization of features and workflow
- **Seamless Integration**: Works with existing Supabase and Firebase infrastructure
- **Quality Assurance**: Built-in validation for educational content standards

## Why Build a Custom Dashboard

### Advantages Over Third-Party CMS

#### ✅ **Perfect Fit for Educational Content**
- Custom validation for historical accuracy
- Built-in difficulty distribution checking
- Educational standards compliance
- Specialized workflow for trivia questions

#### ✅ **Cost Benefits**
- **No Monthly Fees**: Avoid $50-200/month CMS subscriptions
- **Hosting Only**: ~$10-20/month for dashboard hosting
- **One-time Investment**: Development cost vs. ongoing fees
- **ROI**: Pays for itself within 6-12 months

#### ✅ **Technical Advantages**
- **Full Control**: Complete customization capability
- **Performance**: Optimized for your specific data structure
- **Security**: You control all access and permissions
- **Integration**: Seamless connection with existing systems

#### ✅ **Business Benefits**
- **Team Empowerment**: Non-technical users can manage content
- **Quality Control**: Built-in approval workflows
- **Scalability**: Add features as needed
- **Data Ownership**: Complete control over content and data

### Comparison with Alternatives

| Feature | Custom Dashboard | Third-Party CMS | Current System |
|---------|------------------|-----------------|----------------|
| Monthly Cost | $10-20 | $50-200 | $0 |
| Customization | Full | Limited | N/A |
| Non-tech Users | ✅ | ✅ | ❌ |
| Educational Focus | ✅ | ❌ | ✅ |
| Integration | Perfect | Complex | Perfect |
| Data Control | Full | Limited | Full |

## Architecture & Tech Stack

### Recommended Technology Stack

```typescript
// Frontend Dashboard
Framework: React 18 + TypeScript
Styling: Tailwind CSS (consistent with main app)
State Management: React Context API + React Query
Forms: React Hook Form + Zod validation
Rich Text: TinyMCE or Quill.js
File Upload: React Dropzone

// Backend API
Framework: Next.js API routes (or Express.js)
Database: Supabase PostgreSQL (existing)
Authentication: Firebase Auth (existing)
File Storage: Supabase Storage (existing)
Validation: Zod schemas

// Hosting & Deployment
Frontend: Vercel or Firebase Hosting
API: Vercel serverless functions
Database: Supabase (existing)
CDN: Automatic with Vercel/Firebase
```

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Content       │    │   Dashboard     │    │   Main Trivia   │
│   Creators      │───▶│   Frontend      │    │   App           │
│   (Non-tech)    │    │   (React)       │    │   (Existing)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        │
                       ┌─────────────────┐               │
                       │   Dashboard     │               │
                       │   API           │               │
                       │   (Next.js)     │               │
                       └─────────────────┘               │
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Supabase      │    │   Export        │
                       │   Database      │───▶│   Scripts       │
                       │   (PostgreSQL)  │    │   (Existing)    │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Supabase      │    │   JSON Bundles  │
                       │   Storage       │◀───│   (Quarterly)   │
                       │   (Files)       │    │                 │
                       └─────────────────┘    └─────────────────┘
```

## Core Features

### 1. Question Management Interface

#### Question Editor
```typescript
interface QuestionEditor {
  // Basic Information
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  
  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
  period: string;
  tags: string[];
  
  // Rich Content
  images?: QuestionImage[];
  sources?: HistoricalSource[];
  
  // Workflow
  status: 'draft' | 'review' | 'approved' | 'published';
  createdBy: string;
  reviewedBy?: string;
  comments?: Comment[];
}

interface QuestionImage {
  url: string;
  caption: string;
  altText: string;
  source: string;
}

interface HistoricalSource {
  title: string;
  author: string;
  url?: string;
  type: 'book' | 'article' | 'website' | 'academic';
}
```

#### Key Features
- **Rich Text Editor**: For explanations with formatting, links, and images
- **Image Management**: Upload and organize question-related images
- **Source Citations**: Track historical sources and references
- **Duplicate Detection**: Prevent duplicate questions
- **Preview Mode**: See how questions will appear in the app
- **Bulk Operations**: Edit multiple questions at once

### 2. Bundle Management

#### Bundle Editor
```typescript
interface BundleEditor {
  // Basic Information
  name: string;
  description: string;
  category: string;
  subcategory: string;
  
  // Question Selection
  questionIds: string[];
  questionCount: number;
  
  // Validation
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  formatBreakdown: {
    multipleChoice: number;
    trueFalse: number;
    fillInBlank: number;
  };
  
  // Metadata
  price: number;
  isPremium: boolean;
  releaseDate: Date;
  version: string;
  
  // Workflow
  status: 'draft' | 'review' | 'approved' | 'published';
}
```

#### Key Features
- **Drag & Drop**: Organize questions within bundles
- **Auto-Validation**: Check difficulty and format distribution
- **Preview Generator**: Test bundle before publishing
- **Pricing Management**: Set bundle prices and premium status
- **Version Control**: Track bundle versions and changes

### 3. Content Workflow System

#### Workflow States
```typescript
type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

interface WorkflowTransition {
  from: ContentStatus;
  to: ContentStatus;
  requiredRole: UserRole;
  requiresComment?: boolean;
}

type UserRole = 'editor' | 'reviewer' | 'admin' | 'super_admin';
```

#### Workflow Features
- **Role-Based Permissions**: Different access levels for different users
- **Approval Process**: Multi-step review before publishing
- **Comment System**: Feedback and discussion on content
- **Version History**: Track all changes and revisions
- **Notification System**: Email alerts for workflow events

### 4. Quality Assurance Tools

#### Validation Features
```typescript
interface QualityCheck {
  type: 'duplicate' | 'difficulty' | 'format' | 'sources' | 'accuracy';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

interface ValidationResult {
  isValid: boolean;
  checks: QualityCheck[];
  score: number; // 0-100 quality score
}
```

#### Built-in Validations
- **Duplicate Detection**: Check for similar questions
- **Difficulty Balance**: Ensure proper distribution
- **Format Requirements**: Validate question structure
- **Source Citations**: Require historical sources
- **Accuracy Prompts**: Remind reviewers to fact-check
- **Readability**: Check question clarity and grammar

## Implementation Plan

### Phase 1: MVP Dashboard (4-6 weeks)

#### Week 1-2: Foundation
```typescript
// Core Setup
- Project initialization (Next.js + React + TypeScript)
- Authentication integration (Firebase Auth)
- Database schema creation (Supabase)
- Basic routing and layout
- User role management
```

#### Week 3-4: Question Management
```typescript
// Question CRUD
- Question creation form
- Question editing interface
- Question list/search
- Basic validation
- Draft/publish workflow
```

#### Week 5-6: Bundle Management
```typescript
// Bundle Features
- Bundle creation interface
- Question selection for bundles
- Basic difficulty validation
- Export to existing JSON format
- Integration with current scripts
```

### Phase 2: Enhanced Features (4-6 weeks)

#### Week 7-8: Rich Content
```typescript
// Advanced Editing
- Rich text editor integration
- Image upload and management
- Source citation system
- Preview functionality
- Bulk operations
```

#### Week 9-10: Workflow System
```typescript
// Content Workflow
- Review/approval process
- Comment system
- Role-based permissions
- Notification system
- Version history
```

#### Week 11-12: Quality Assurance
```typescript
// QA Tools
- Duplicate detection
- Advanced validation
- Quality scoring
- Analytics dashboard
- Reporting features
```

### Phase 3: Polish & Optimization (2-4 weeks)

#### Week 13-14: User Experience
```typescript
// UX Improvements
- Performance optimization
- Mobile responsiveness
- Accessibility features
- User onboarding
- Help documentation
```

#### Week 15-16: Integration & Testing
```typescript
// Final Integration
- Complete testing
- Production deployment
- User training
- Documentation
- Monitoring setup
```

## Database Schema

### Extended Supabase Schema

```sql
-- Content Management Tables

-- Users and Roles
CREATE TABLE cms_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'editor',
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Questions
CREATE TABLE cms_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  
  -- Metadata
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  period TEXT NOT NULL,
  tags TEXT[],
  
  -- Rich Content
  images JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  
  -- Workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  created_by UUID REFERENCES cms_users(id),
  reviewed_by UUID REFERENCES cms_users(id),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- Quality
  quality_score INTEGER DEFAULT 0,
  validation_results JSONB DEFAULT '{}'
);

-- Bundles
CREATE TABLE cms_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  
  -- Question Management
  question_ids UUID[],
  question_count INTEGER DEFAULT 0,
  
  -- Validation
  difficulty_breakdown JSONB DEFAULT '{"easy": 0, "medium": 0, "hard": 0}',
  format_breakdown JSONB DEFAULT '{"multipleChoice": 0, "trueFalse": 0, "fillInBlank": 0}',
  
  -- Metadata
  price DECIMAL(10,2) DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  release_date DATE,
  version TEXT DEFAULT 'v1',
  
  -- Workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  created_by UUID REFERENCES cms_users(id),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Comments and Reviews
CREATE TABLE cms_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('question', 'bundle')),
  content_id UUID NOT NULL,
  comment TEXT NOT NULL,
  comment_type TEXT DEFAULT 'general' CHECK (comment_type IN ('general', 'review', 'suggestion', 'approval')),
  
  -- User
  created_by UUID REFERENCES cms_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Threading
  parent_id UUID REFERENCES cms_comments(id),
  is_resolved BOOLEAN DEFAULT false
);

-- Version History
CREATE TABLE cms_version_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('question', 'bundle')),
  content_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  changes JSONB NOT NULL,
  change_summary TEXT,
  
  -- User
  created_by UUID REFERENCES cms_users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE cms_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  content_type TEXT,
  content_id UUID,
  user_id UUID REFERENCES cms_users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_cms_questions_status ON cms_questions(status);
CREATE INDEX idx_cms_questions_created_by ON cms_questions(created_by);
CREATE INDEX idx_cms_questions_difficulty ON cms_questions(difficulty);
CREATE INDEX idx_cms_questions_category ON cms_questions(category);
CREATE INDEX idx_cms_bundles_status ON cms_bundles(status);
CREATE INDEX idx_cms_comments_content ON cms_comments(content_type, content_id);
CREATE INDEX idx_cms_version_history_content ON cms_version_history(content_type, content_id);

-- Row Level Security (RLS)
ALTER TABLE cms_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view published content" ON cms_questions
  FOR SELECT USING (status = 'published' OR created_by = auth.uid());

CREATE POLICY "Editors can create questions" ON cms_questions
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM cms_users WHERE role IN ('editor', 'reviewer', 'admin')));

CREATE POLICY "Users can edit their own drafts" ON cms_questions
  FOR UPDATE USING (created_by = auth.uid() AND status = 'draft');

CREATE POLICY "Reviewers can approve content" ON cms_questions
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM cms_users WHERE role IN ('reviewer', 'admin')));
```

## User Interface Components

### 1. Question Editor Component

```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const questionSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters'),
  options: z.array(z.string().min(1)).length(4, 'Must have exactly 4 options'),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().min(20, 'Explanation must be at least 20 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(1),
  region: z.string().min(1),
  period: z.string().min(1),
  tags: z.array(z.string()),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const QuestionEditor: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      // Submit to API
      await submitQuestion(data);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Question</h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {previewMode ? (
          <QuestionPreview data={watch()} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Question *
              </label>
              <textarea
                {...register('question')}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter your question..."
              />
              {errors.question && (
                <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Answer Options *
              </label>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="radio"
                    {...register('correctAnswer', { valueAsNumber: true })}
                    value={index}
                    className="mr-3"
                  />
                  <input
                    {...register(`options.${index}`)}
                    type="text"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
              {errors.options && (
                <p className="text-red-500 text-sm mt-1">All options are required</p>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty *</label>
                <select
                  {...register('difficulty')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select difficulty...</option>
                  <option value="easy">Easy (Elementary)</option>
                  <option value="medium">Medium (Middle School)</option>
                  <option value="hard">Hard (High School)</option>
                </select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Region *</label>
                <select
                  {...register('region')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select region...</option>
                  <option value="Ancient Egypt">Ancient Egypt</option>
                  <option value="Ancient Rome">Ancient Rome</option>
                  <option value="Ancient Greece">Ancient Greece</option>
                  <option value="Ancient China">Ancient China</option>
                  <option value="Mesopotamia">Mesopotamia</option>
                  <option value="Ancient India">Ancient India</option>
                  <option value="Ancient Persia">Ancient Persia</option>
                  <option value="Ancient Maya">Ancient Maya</option>
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  {...register('category')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  <option value="Politics">Politics</option>
                  <option value="Religion">Religion</option>
                  <option value="Culture">Culture</option>
                  <option value="Military">Military</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Art">Art</option>
                  <option value="Science">Science</option>
                  <option value="Literature">Literature</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Period *</label>
                <input
                  {...register('period')}
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3100-30 BCE"
                />
                {errors.period && (
                  <p className="text-red-500 text-sm mt-1">{errors.period.message}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-gray-500 text-sm mt-1">
                e.g., pharaoh, pyramid, ancient egypt, archaeology
              </p>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Explanation *
              </label>
              <textarea
                {...register('explanation')}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Explain why this is the correct answer and provide historical context..."
              />
              {errors.explanation && (
                <p className="text-red-500 text-sm mt-1">{errors.explanation.message}</p>
              )}
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Historical Sources
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Source title, author, publication"
                />
                <button
                  type="button"
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Add another source
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Submit for Review
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const QuestionPreview: React.FC<{ data: Partial<QuestionFormData> }> = ({ data }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Question Preview</h3>
      
      {/* Question */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <h4 className="font-medium mb-3">{data.question || 'Question text will appear here...'}</h4>
        
        {/* Options */}
        <div className="space-y-2">
          {data.options?.map((option, index) => (
            <div
              key={index}
              className={`p-2 border rounded ${
                data.correctAnswer === index ? 'bg-green-100 border-green-300' : 'bg-gray-50'
              }`}
            >
              {option || `Option ${index + 1}`}
              {data.correctAnswer === index && (
                <span className="text-green-600 text-sm ml-2">✓ Correct</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="bg-blue-100 p-2 rounded">
          <strong>Difficulty:</strong> {data.difficulty || 'Not set'}
        </div>
        <div className="bg-purple-100 p-2 rounded">
          <strong>Region:</strong> {data.region || 'Not set'}
        </div>
        <div className="bg-orange-100 p-2 rounded">
          <strong>Category:</strong> {data.category || 'Not set'}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white p-4 rounded-lg">
        <h5 className="font-medium mb-2">Explanation:</h5>
        <p className="text-gray-700">
          {data.explanation || 'Explanation will appear here...'}
        </p>
      </div>
    </div>
  );
};

export default QuestionEditor;
```

### 2. Bundle Management Component

```typescript
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Bundle {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  questionCount: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  status: 'draft' | 'review' | 'approved' | 'published';
}

interface Question {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
}

const BundleManager: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedBundle) return;

    const newQuestionIds = Array.from(selectedBundle.questionIds);
    const [reorderedItem] = newQuestionIds.splice(result.source.index, 1);
    newQuestionIds.splice(result.destination.index, 0, reorderedItem);

    setSelectedBundle({
      ...selectedBundle,
      questionIds: newQuestionIds,
    });
  };

  const addQuestionToBundle = (questionId: string) => {
    if (!selectedBundle) return;

    setSelectedBundle({
      ...selectedBundle,
      questionIds: [...selectedBundle.questionIds, questionId],
      questionCount: selectedBundle.questionCount + 1,
    });
  };

  const removeQuestionFromBundle = (questionId: string) => {
    if (!selectedBundle) return;

    setSelectedBundle({
      ...selectedBundle,
      questionIds: selectedBundle.questionIds.filter(id => id !== questionId),
      questionCount: selectedBundle.questionCount - 1,
    });
  };

  const validateBundle = (bundle: Bundle): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (bundle.questionCount < 10) {
      issues.push('Bundle must have at least 10 questions');
    }
    
    if (bundle.questionCount > 100) {
      issues.push('Bundle cannot have more than 100 questions');
    }

    // Check difficulty distribution
    const total = bundle.difficultyBreakdown.easy + bundle.difficultyBreakdown.medium + bundle.difficultyBreakdown.hard;
    if (total !== bundle.questionCount) {
      issues.push('Difficulty breakdown does not match question count');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bundle List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Bundles</h2>
            <div className="space-y-3">
              {bundles.map(bundle => (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBundle?.id === bundle.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-medium">{bundle.name}</h3>
                  <p className="text-sm text-gray-600">{bundle.questionCount} questions</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      bundle.status === 'published' ? 'bg-green-100 text-green-800' :
                      bundle.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      bundle.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {bundle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bundle Editor */}
        <div className="lg:col-span-2">
          {selectedBundle ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Edit Bundle: {selectedBundle.name}</h2>
              
              {/* Bundle Validation */}
              <div className="mb-6">
                {(() => {
                  const validation = validateBundle(selectedBundle);
                  return validation.isValid ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm">✓ Bundle is valid and ready for review</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-medium">Issues found:</p>
                      <ul className="text-red-700 text-sm mt-1">
                        {validation.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>

              {/* Question Management */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="bundle-questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {selectedBundle.questionIds.map((questionId, index) => (
                        <Draggable key={questionId} draggableId={questionId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 p-3 rounded-lg border"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Question {index + 1}</span>
                                <button
                                  onClick={() => removeQuestionFromBundle(questionId)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-500">Select a bundle to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleManager;
```

## Integration with Existing System

### Seamless Workflow Integration

The custom dashboard will integrate seamlessly with the existing system through a well-defined workflow:

#### 1. Content Creation Flow
```typescript
// Dashboard Workflow
1. Content Creator → Creates/edits questions in dashboard
2. Reviewer → Reviews and approves content
3. Admin → Publishes approved content
4. Export Script → Converts to existing JSON format
5. Upload Script → Publishes to Supabase Storage
6. Main App → Consumes content (no changes needed)
```

#### 2. Data Export Integration
```typescript
// Export Service
class DashboardExportService {
  async exportToLegacyFormat(bundleId: string): Promise<QuestionBundle> {
    const bundle = await this.getBundleFromCMS(bundleId);
    const questions = await this.getQuestionsFromCMS(bundle.questionIds);
    
    // Convert to existing format
    return {
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
        region: q.region,
        period: q.period,
        tags: q.tags
      })),
      // ... other existing fields
    };
  }
}
```

#### 3. Automated Publishing Pipeline
```typescript
// Automated Pipeline
const publishingPipeline = {
  1: 'Content approved in dashboard',
  2: 'Trigger export script automatically',
  3: 'Generate JSON bundle in existing format',
  4: 'Upload to Supabase Storage',
  5: 'Notify main app of new content',
  6: 'Update version tracking'
};
```

## Cost Analysis

### Development Investment

#### Initial Development Costs
```typescript
// Time Investment (16 weeks total)
Phase 1 (MVP): 6 weeks × $100/hour × 40 hours = $24,000
Phase 2 (Enhanced): 6 weeks × $100/hour × 40 hours = $24,000
Phase 3 (Polish): 4 weeks × $100/hour × 40 hours = $16,000

Total Development: $64,000 (one-time)
```

#### Ongoing Operational Costs
```typescript
// Monthly Costs
Hosting (Vercel): $20/month
Database (Supabase): $25/month (Pro plan)
CDN & Storage: $10/month
Monitoring: $15/month

Total Monthly: $70/month = $840/year
```

### ROI Analysis

#### Cost Comparison (5 years)
```typescript
// Custom Dashboard
Development: $64,000 (one-time)
Operations: $840/year × 5 = $4,200
Total 5-year cost: $68,200

// Third-party CMS (e.g., Contentful)
Setup: $5,000 (integration)
Monthly: $150/month × 60 months = $9,000
Total 5-year cost: $14,000

// But consider limitations:
- Limited customization
- Vendor lock-in
- Feature restrictions
- No educational focus
```

#### Business Value
```typescript
// Productivity Gains
Content creation speed: 10x faster
Quality improvements: 50% fewer errors
Team efficiency: 3 non-technical content creators
Time savings: 20 hours/week × $50/hour = $1,000/week

Annual savings: $52,000
ROI timeline: 15 months
```

## Security & Permissions

### Role-Based Access Control

#### User Roles
```typescript
interface UserRole {
  editor: {
    permissions: [
      'create_questions',
      'edit_own_questions',
      'view_all_questions',
      'submit_for_review'
    ];
  };
  reviewer: {
    permissions: [
      'view_all_questions',
      'review_questions',
      'approve_questions',
      'add_comments',
      'request_changes'
    ];
  };
  admin: {
    permissions: [
      'all_editor_permissions',
      'all_reviewer_permissions',
      'manage_users',
      'publish_content',
      'manage_bundles',
      'view_analytics'
    ];
  };
  super_admin: {
    permissions: [
      'all_permissions',
      'system_configuration',
      'data_export',
      'user_management'
    ];
  };
}
```

#### Security Features
```typescript
// Authentication & Authorization
- Firebase Auth integration (existing)
- JWT token validation
- Role-based route protection
- API endpoint security
- Session management

// Data Protection
- Row-level security (Supabase RLS)
- Input validation and sanitization
- XSS protection
- CSRF protection
- Rate limiting

// Audit Trail
- All actions logged
- Version history tracking
- User activity monitoring
- Change attribution
- Rollback capabilities
```

## Quality Assurance Features

### Built-in Validation System

#### Question Quality Checks
```typescript
interface QualityAssurance {
  duplicateDetection: {
    algorithm: 'fuzzy_matching';
    threshold: 0.85;
    checks: ['question_text', 'answer_options'];
  };
  
  difficultyValidation: {
    readabilityScore: 'flesch_kincaid';
    vocabularyLevel: 'grade_appropriate';
    conceptComplexity: 'age_appropriate';
  };
  
  historicalAccuracy: {
    sourceRequirement: 'minimum_two_sources';
    factChecking: 'reviewer_verification';
    citationFormat: 'academic_standard';
  };
  
  formatValidation: {
    questionLength: { min: 10, max: 200 };
    optionLength: { min: 1, max: 100 };
    explanationLength: { min: 20, max: 500 };
  };
}
```

#### Automated Quality Scoring
```typescript
class QualityScorer {
  calculateScore(question: Question): QualityScore {
    const scores = {
      clarity: this.assessClarity(question.question),
      accuracy: this.assessAccuracy(question.sources),
      difficulty: this.assessDifficulty(question),
      completeness: this.assessCompleteness(question),
      uniqueness: this.assessUniqueness(question)
    };
    
    return {
      overall: Object.values(scores).reduce((a, b) => a + b) / 5,
      breakdown: scores,
      recommendations: this.generateRecommendations(scores)
    };
  }
}
```

## Deployment Strategy

### Phased Rollout Plan

#### Phase 1: Internal Testing (2 weeks)
```typescript
// Limited Access
- Admin users only
- Test environment
- Core functionality validation
- Bug fixes and refinements
```

#### Phase 2: Beta Testing (4 weeks)
```typescript
// Expanded Access
- Selected content creators
- Feedback collection
- Workflow optimization
- Performance testing
```

#### Phase 3: Full Deployment (2 weeks)
```typescript
// Production Release
- All users migrated
- Training sessions
- Documentation complete
- Support system active
```

### Technical Deployment

#### Infrastructure Setup
```typescript
// Production Environment
Frontend: Vercel (automatic deployments)
API: Vercel serverless functions
Database: Supabase (production instance)
CDN: Vercel Edge Network
Monitoring: Vercel Analytics + Sentry
Backups: Automated daily backups
```

#### CI/CD Pipeline
```typescript
// Automated Deployment
1. Code push to main branch
2. Automated testing (Jest + Cypress)
3. Build and deploy to staging
4. Manual QA approval
5. Deploy to production
6. Health checks and monitoring
```

## Future Enhancements

### Planned Features (Year 2)

#### Advanced Content Features
```typescript
// Enhanced Capabilities
- Multi-media questions (images, audio, video)
- Interactive question types
- Adaptive difficulty algorithms
- Personalized learning paths
- Community question submissions
- AI-powered content suggestions
```

#### Analytics & Insights
```typescript
// Data-Driven Improvements
- Question performance analytics
- User engagement metrics
- Content effectiveness tracking
- A/B testing framework
- Predictive content recommendations
- Learning outcome analysis
```

#### Integration Expansions
```typescript
// Extended Integrations
- Learning Management Systems (LMS)
- Educational platforms
- Social sharing features
- Collaborative editing
- Real-time notifications
- Mobile app for content creation
```

### Scalability Considerations

#### Technical Scaling
```typescript
// Performance Optimization
- Database query optimization
- Caching strategies (Redis)
- CDN optimization
- Image optimization
- Lazy loading
- Progressive web app features
```

#### Team Scaling
```typescript
// Organizational Growth
- Multi-tenant architecture
- Team collaboration features
- Advanced workflow management
- Automated content moderation
- Bulk operations
- API for third-party integrations
```

## Conclusion

Building a custom content management dashboard for the Ancient History Trivia app is a strategic investment that will:

### ✅ **Immediate Benefits**
- Enable non-technical content creation
- Improve content quality and consistency
- Reduce development bottlenecks
- Provide full control over features and costs

### ✅ **Long-term Value**
- Scale with business growth
- Adapt to changing requirements
- Maintain competitive advantage
- Build institutional knowledge

### ✅ **Technical Excellence**
- Seamless integration with existing systems
- Modern, maintainable codebase
- Security and performance best practices
- Comprehensive documentation and testing

### 🎯 **Recommendation: Proceed with Development**

The custom dashboard represents the optimal solution for the Ancient History Trivia app's content management needs. It provides the perfect balance of functionality, cost-effectiveness, and strategic value while maintaining full control over the educational content creation process.

**Next Steps:**
1. Approve the implementation plan
2. Set up development environment
3. Begin Phase 1 development
4. Establish content creator onboarding process
5. Plan training and documentation

This investment will transform content creation from a technical bottleneck into a streamlined, efficient process that empowers educators and historians to contribute directly to the app's educational mission.

---

## Implementation Decision & Quick Start Guide

### Architecture Decision: Separate Application (Recommended)

**Decision: Build the CMS as a SEPARATE application** for optimal security, maintainability, and user experience.

#### ✅ **Why Separate is Better:**

1. **🔐 Security Isolation**
   - Content management requires different security permissions
   - Keeps admin functions separate from user-facing app
   - Easier to secure and audit

2. **👥 Different User Base**
   - Main app: Students, trivia players
   - CMS: Historians, educators, content reviewers
   - Different UX needs and workflows

3. **🚀 Independent Deployment**
   - Update CMS without affecting main app
   - Different release cycles
   - Easier maintenance and testing

4. **📱 Platform Optimization**
   - Main app: Mobile-first, PWA optimized
   - CMS: Desktop-first, productivity focused
   - Different performance requirements

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Main Trivia   │    │   CMS Dashboard │
│   App (PWA)     │    │   (Admin Tool)  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │   Supabase      │
         │   Database      │
         │   + Storage     │
         └─────────────────┘
```

### Data Flow Integration

1. **Content Creation**: CMS creates questions in `cms_questions` table
2. **Review Process**: Workflow moves content through approval states
3. **Publishing**: Export service converts to main app format
4. **Consumption**: Main app reads from existing JSON bundles (no changes needed)

## Quick Start Implementation Guide

### Step 1: Project Setup

#### Create New CMS Project
```bash
# In your development folder (alongside ancient-history-pwa)
npx create-next-app@latest ancient-history-cms --typescript --tailwind --eslint
cd ancient-history-cms
```

#### Install Required Dependencies
```bash
# Core dependencies
npm install @supabase/supabase-js
npm install firebase
npm install react-hook-form @hookform/resolvers zod
npm install @tanstack/react-query
npm install react-beautiful-dnd
npm install @tinymce/tinymce-react
npm install @heroicons/react

# Development dependencies
npm install -D @types/react-beautiful-dnd
```

### Step 2: Environment Configuration

#### Create Environment File
```bash
# Copy environment variables from main app
cp ../ancient-history-pwa/.env.example .env.local
```

#### Update .env.local
```env
# Use same credentials as main app for shared infrastructure
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Step 3: Project Structure

#### Create Directory Structure
```
ancient-history-cms/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── questions/
│   │   │   ├── QuestionEditor.tsx
│   │   │   ├── QuestionList.tsx
│   │   │   └── QuestionPreview.tsx
│   │   ├── bundles/
│   │   │   ├── BundleManager.tsx
│   │   │   ├── BundleEditor.tsx
│   │   │   └── BundleValidator.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── index.tsx              # Dashboard home
│   │   ├── questions/
│   │   │   ├── index.tsx          # Questions list
│   │   │   ├── new.tsx            # Create question
│   │   │   └── [id].tsx           # Edit question
│   │   ├── bundles/
│   │   │   ├── index.tsx          # Bundles list
│   │   │   ├── new.tsx            # Create bundle
│   │   │   └── [id].tsx           # Edit bundle
│   │   └── api/
│   │       ├── questions/
│   │       └── bundles/
│   ├── lib/
│   │   ├── supabase.ts            # Database client
│   │   ├── auth.ts                # Authentication
│   │   └── export.ts              # Export service
│   ├── types/
│   │   ├── cms.ts                 # CMS-specific types
│   │   └── database.ts            # Database types
│   └── utils/
│       ├── validation.ts          # Form validation
│       └── quality.ts             # Quality scoring
├── public/
└── package.json
```

### Step 4: Core Configuration Files

#### Database Client (src/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CMS-specific database operations
export class CMSDatabase {
  async getQuestions(filters?: any) {
    return supabase
      .from('cms_questions')
      .select('*')
      .order('created_at', { ascending: false });
  }

  async createQuestion(question: any) {
    return supabase
      .from('cms_questions')
      .insert(question)
      .select()
      .single();
  }

  async updateQuestion(id: string, updates: any) {
    return supabase
      .from('cms_questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  }
}

export const cmsDb = new CMSDatabase();
```

#### Authentication (src/lib/auth.ts)
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export class CMSAuth {
  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async signOut() {
    return signOut(auth);
  }

  async getCurrentUser() {
    return auth.currentUser;
  }
}

export const cmsAuth = new CMSAuth();
```

#### Types (src/types/cms.ts)
```typescript
export interface CMSQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
  period: string;
  tags: string[];
  images?: QuestionImage[];
  sources?: HistoricalSource[];
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  createdBy: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  qualityScore?: number;
}

export interface CMSBundle {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  questionIds: string[];
  questionCount: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  formatBreakdown: {
    multipleChoice: number;
    trueFalse: number;
    fillInBlank: number;
  };
  price: number;
  isPremium: boolean;
  releaseDate: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionImage {
  url: string;
  caption: string;
  altText: string;
  source: string;
}

export interface HistoricalSource {
  title: string;
  author: string;
  url?: string;
  type: 'book' | 'article' | 'website' | 'academic';
}

export type UserRole = 'editor' | 'reviewer' | 'admin' | 'super_admin';

export interface CMSUser {
  id: string;
  role: UserRole;
  displayName: string;
  email: string;
  createdAt: string;
  lastActive: string;
}
```

### Step 5: Database Schema Setup

#### Run Database Migration
```sql
-- Execute this in your Supabase SQL editor
-- (Use the complete schema from the main document)

-- Users and Roles
CREATE TABLE cms_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'editor',
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Questions (abbreviated - see full schema in main document)
CREATE TABLE cms_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  period TEXT NOT NULL,
  tags TEXT[],
  images JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  created_by UUID REFERENCES cms_users(id),
  reviewed_by UUID REFERENCES cms_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  quality_score INTEGER DEFAULT 0,
  validation_results JSONB DEFAULT '{}'
);

-- Add indexes and RLS policies (see full schema in main document)
```

### Step 6: First Component - Layout

#### Main Layout (src/components/layout/Layout.tsx)
```typescript
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### Step 7: Development Commands

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

#### Start Development
```bash
# Run CMS on different port than main app
npm run dev

# CMS will be available at http://localhost:3001
# Main app continues running on http://localhost:5173
```

## Next Development Steps

### Week 1-2: Foundation
1. ✅ Set up project structure
2. ✅ Configure authentication and database
3. ✅ Create basic layout and navigation
4. ✅ Implement user role management

### Week 3-4: Question Management
1. Build QuestionEditor component (use code from main document)
2. Implement question list and search
3. Add validation and quality scoring
4. Create preview functionality

### Week 5-6: Bundle Management
1. Build BundleManager component
2. Implement drag-and-drop question organization
3. Add bundle validation and quality checks
4. Create export functionality

### Week 7-8: Integration & Polish
1. Implement export to main app format
2. Add automated publishing pipeline
3. Create user onboarding and documentation
4. Deploy to production

## Benefits of This Approach

### ✅ **Immediate Advantages**
- **Clean Separation**: CMS and main app have distinct purposes
- **Shared Infrastructure**: Both use same Supabase/Firebase setup
- **Independent Development**: Build CMS without affecting main app
- **Security**: Admin functions isolated from user-facing features

### ✅ **Long-term Benefits**
- **Scalability**: Each app optimized for its specific use case
- **Maintainability**: Easier to update and debug separate codebases
- **Team Efficiency**: Content creators work in dedicated environment
- **Professional Workflow**: Enterprise-grade content management system

**This approach provides a professional, scalable content management solution while keeping your main trivia app completely unchanged. The CMS becomes a powerful admin tool that feeds high-quality educational content to your existing app seamlessly!**
