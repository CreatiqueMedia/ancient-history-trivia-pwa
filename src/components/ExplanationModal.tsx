import React, { useState } from 'react';
import { 
  XMarkIcon, 
  BookmarkIcon,
  ShareIcon,
  LightBulbIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { RichExplanation, BookmarkedExplanation } from '../types/enhancements';
import { Question } from '../types';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  explanation: RichExplanation;
  isBookmarked?: boolean;
  onBookmark?: (questionId: string) => void;
  onShare?: (questionId: string) => void;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  explanation,
  isBookmarked = false,
  onBookmark,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'context' | 'related'>('explanation');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(question.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(question.id);
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: 'Ancient History Question',
          text: question.question,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `${question.question}\n\nAnswer: ${question.options[question.correctAnswer]}\n\n${explanation.basic}`
        );
      }
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Question Explanation
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30' 
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this explanation'}
              >
                {isBookmarked ? (
                  <BookmarkIcon className="w-5 h-5" />
                ) : (
                  <BookmarkOutlineIcon className="w-5 h-5" />
                )}
              </button>
              
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Share this question"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Question Display */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {question.question}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === question.correctAnswer
                      ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300'
                      : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {index === question.correctAnswer && (
                    <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Question Metadata */}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {question.region}
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
                <ClockIcon className="w-3 h-3 mr-1" />
                {question.period}
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                {question.category}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('explanation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'explanation'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Explanation
              </button>
              <button
                onClick={() => setActiveTab('context')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'context'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Historical Context
              </button>
              {(explanation.related_topics?.length || explanation.fun_facts?.length) && (
                <button
                  onClick={() => setActiveTab('related')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'related'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Related & Fun Facts
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {activeTab === 'explanation' && (
              <div className="space-y-6">
                {/* Basic Explanation */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Answer Explanation
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {explanation.basic}
                  </p>
                </div>

                {/* Images */}
                {explanation.images && explanation.images.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Visual References
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {explanation.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <img
                            src={image.url}
                            alt={image.alt_text}
                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(index)}
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {image.caption}
                          </p>
                          {image.source && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Source: {image.source}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learn More Links */}
                {explanation.learn_more_links && explanation.learn_more_links.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Learn More
                    </h4>
                    <div className="space-y-3">
                      {explanation.learn_more_links.map((link, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {link.title}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {link.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Source: {link.source}
                              </p>
                            </div>
                            <button
                              onClick={() => openExternalLink(link.url)}
                              className="ml-3 p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'context' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Historical Context
                </h4>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {explanation.historical_context}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="space-y-6">
                {/* Related Topics */}
                {explanation.related_topics && explanation.related_topics.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Related Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {explanation.related_topics.map((topic, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fun Facts */}
                {explanation.fun_facts && explanation.fun_facts.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Fun Facts
                    </h4>
                    <div className="space-y-3">
                      {explanation.fun_facts.map((fact, index) => (
                        <div
                          key={index}
                          className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                        >
                          <span className="text-yellow-600 dark:text-yellow-400 mr-3 text-lg">
                            💡
                          </span>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {fact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Lightbox */}
          {selectedImage !== null && explanation.images && (
            <div 
              className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={explanation.images[selectedImage].url}
                  alt={explanation.images[selectedImage].alt_text}
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
                  <p className="text-sm">{explanation.images[selectedImage].caption}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
