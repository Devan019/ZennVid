import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Video, Palette, Languages, Users, Sparkles, FileText, Wand2, Loader2, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';

const VideoConfigUI = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLength, setVideoLength] = useState('30');
  const [script, setScript] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState('');
  const [voiceGender, setVoiceGender] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const styles = [
    { id: 'anime', name: 'Anime', emoji: '🎌', color: 'bg-pink-500' },
    { id: 'realistic', name: 'Realistic', emoji: '📸', color: 'bg-blue-500' },
    { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: 'bg-yellow-500' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖', color: 'bg-purple-500' },
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️', color: 'bg-green-500' },
    { id: 'retro', name: 'Retro', emoji: '📼', color: 'bg-orange-500' },
    { id: 'minimalist', name: 'Minimalist', emoji: '⚪', color: 'bg-gray-500' },
    { id: 'watercolor', name: 'Watercolor', emoji: '🎭', color: 'bg-indigo-500' }
  ];

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish (Spain)' },
    { value: 'es-MX', label: 'Spanish (Mexico)' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ru-RU', label: 'Russian' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'ar-SA', label: 'Arabic' }
  ];

  const getMaxChars = () => {
    return videoLength === '30' ? 200 : videoLength === '60' ? 400 : 0;
  };

  const handleSubmit = () => {
    console.log({
      videoTitle,
      videoLength,
      script,
      selectedStyle,
      voiceLanguage,
      voiceGender
    });
  };

  const generateAIScript = async () => {
    if (!videoTitle.trim()) {
      alert('Please enter a video title first to generate AI script');
      return;
    }

    if (!videoLength) {
      alert('Please select video length first to generate appropriate script');
      return;
    }

    setIsGeneratingScript(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const shortScripts = [
        `Welcome to our guide on ${videoTitle}! In the next 30 seconds, we'll explore the key concepts that make this topic fascinating. Let's dive right in and discover what makes ${videoTitle} so important in today's world.`,
        `Ready to master ${videoTitle}? This quick overview will give you the essential knowledge you need. We'll cover the fundamentals and show you practical applications that you can use immediately.`,
        `${videoTitle} explained in 30 seconds! Here's everything you need to know about this amazing topic. From basics to advanced tips, we've got you covered with this comprehensive yet concise guide.`
      ];

      const longScripts = [
        `Welcome to our comprehensive guide on ${videoTitle}! Over the next minute, we'll take you on an incredible journey through this fascinating subject. First, let's establish the foundation by understanding what ${videoTitle} really means and why it matters in today's rapidly evolving world. We'll explore the key principles, examine real-world applications, and discover how professionals are using these concepts to achieve remarkable results. By the end of this video, you'll have a solid understanding of ${videoTitle} and practical knowledge you can apply immediately. Whether you're a beginner just getting started or someone looking to deepen your expertise, this guide will provide valuable insights that transform your perspective. Let's begin this exciting exploration together and unlock the potential of ${videoTitle}!`,
        `Get ready to become an expert in ${videoTitle}! This comprehensive 60-second masterclass will transform your understanding completely. We'll start with the fundamental concepts that form the backbone of ${videoTitle}, then progress to advanced techniques used by industry leaders. You'll discover proven strategies, common pitfalls to avoid, and insider secrets that aren't taught anywhere else. We'll examine case studies, explore practical applications, and show you step-by-step methods that guarantee success. This isn't just theory – everything we cover has been tested and proven effective in real-world scenarios. By the time we're finished, you'll have the knowledge and confidence to implement ${videoTitle} strategies that deliver outstanding results. Don't miss a single second of this game-changing content!`,
        `Dive deep into the world of ${videoTitle} with this expert-level analysis! In just 60 seconds, we'll unpack years of research and experience into actionable insights you can use today. Starting with the historical context that shaped ${videoTitle}, we'll move through current trends, emerging opportunities, and future predictions. You'll learn the methodologies that professionals use, understand the science behind the strategies, and gain access to tools and techniques that typically cost thousands to learn. We'll debunk common myths, reveal surprising truths, and provide you with a roadmap for success. This comprehensive overview combines theoretical knowledge with practical wisdom, ensuring you walk away with both understanding and ability. Prepare to see ${videoTitle} from an entirely new perspective that will revolutionize your approach!`
      ];
      
      const scripts = videoLength === '30' ? shortScripts : longScripts;
      const randomScript = scripts[Math.floor(Math.random() * scripts.length)];
      setScript(randomScript);
      setIsGeneratingScript(false);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen`}>
      <motion.div
        className=" mx-auto w-auto desktop:max-w-5xl desktop:mr-36 lg:max-w-4xl mr-12  xlg:float-none float-right "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8 ">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Video Creator Studio
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Configure your perfect video with AI-powered customization</p>
        </motion.div>

        <div className="space-y-8 ">
          {/* Video Title - First */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0  backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Video Title
                </CardTitle>
                <CardDescription>
                  Enter a compelling title for your video content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="video-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="video-title"
                    type="text"
                    placeholder="Enter your video title..."
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Video Length - Second */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Video Length
                </CardTitle>
                <CardDescription>
                  Choose the duration for your video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={videoLength}
                  onValueChange={setVideoLength}
                  className="flex flex-col space-y-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      videoLength === '30'
                        ? 'border-orange-500 bg-orange-50 text-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setVideoLength('30')}
                  >
                    <RadioGroupItem value="30" id="30sec" />
                    <Label htmlFor="30sec" className="cursor-pointer font-medium flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        <span>30 Seconds</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Quick and engaging short-form content (Max 200 characters script)
                      </p>
                    </Label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      videoLength === '60'
                        ? 'border-orange-500 bg-orange-50 text-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setVideoLength('60')}
                  >
                    <RadioGroupItem value="60" id="60sec" />
                    <Label htmlFor="60sec" className="cursor-pointer font-medium flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎬</span>
                        <span>60 Seconds</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Comprehensive content with detailed explanation (Max 400 characters script)
                      </p>
                    </Label>
                  </motion.div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>

          {/* Video Script - Third */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 bg-transparent backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Video Script
                </CardTitle>
                <CardDescription>
                  Write your video script or let AI generate one based on your title and length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Label htmlFor="script" className="text-sm font-medium self-center">
                      Script
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateAIScript}
                      disabled={isGeneratingScript || !videoTitle.trim() || !videoLength}
                      className="flex items-center gap-2 w-fit"
                    >
                      {isGeneratingScript ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      {isGeneratingScript ? 'Generating...' : 'Generate with AI'}
                    </Button>
                  </div>
                  <Textarea
                    id="script"
                    placeholder={`Enter your video script${videoLength ? ` (max ${getMaxChars()} characters for ${videoLength}s video)` : ''}...`}
                    value={script}
                    onChange={(e) => {
                      const maxChars = getMaxChars();
                      if (maxChars === 0 || e.target.value.length <= maxChars) {
                        setScript(e.target.value);
                      }
                    }}
                    className="min-h-[120px] border-2 focus:border-blue-500 transition-colors resize-none"
                    rows={5}
                    maxLength={getMaxChars() || undefined}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {script.length}/{getMaxChars() || '∞'} characters
                    {videoLength && (
                      <span className="ml-2 text-blue-500">
                        ({videoLength}s video)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0  backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-500" />
                  Visual Style
                </CardTitle>
                <CardDescription>
                  Choose the artistic style for your video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styles.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedStyle === style.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      <div className={`text-center ${selectedStyle === style.id ? 'text-black' : ''}`}>
                        <div className="text-3xl mb-2">{style.emoji}</div>
                        <div className="font-medium text-sm">{style.name}</div>
                        {selectedStyle === style.id && (
                          <Badge className="mt-2 bg-blue-500">Selected</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0  backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-green-500" />
                  Voice Language
                </CardTitle>
                <CardDescription>
                  Select the language for voice narration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="voice-language" className="text-sm font-medium">
                    Language
                  </Label>
                  <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                    <SelectTrigger className="h-12 border-2 focus:border-green-500">
                      <SelectValue placeholder="Choose a language..." />
                    </SelectTrigger>
                    <SelectContent className='z-10 dark:bg-gray-900 bg-white'>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  Voice Gender
                </CardTitle>
                <CardDescription>
                  Choose the gender for the voice narration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={voiceGender}
                  onValueChange={setVoiceGender}
                  className="flex flex-col space-y-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      voiceGender === 'male'
                        ? 'border-pink-500 bg-pink-50 text-black'
                        : 'border-gray-200 hover:border-gray-300 '
                    }`}
                    onClick={() => setVoiceGender('male')}
                  >
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer font-medium flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👨</span>
                        <span>Male Voice</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Professional male narrator with clear pronunciation
                      </p>
                    </Label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      voiceGender === 'female'
                        ? 'border-pink-500 bg-pink-50 text-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setVoiceGender('female')}
                  >
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer font-medium flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👩</span>
                        <span>Female Voice</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Professional female narrator with warm tone
                      </p>
                    </Label>
                  </motion.div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <Separator className="mb-6" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 px-8 border-2"
                onClick={() => console.log('Preview:', { videoTitle, videoLength, script, selectedStyle, voiceLanguage, voiceGender })}
              >
                Preview Settings
              </Button>
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!videoTitle || !videoLength || !script || !selectedStyle || !voiceLanguage || !voiceGender}
                onClick={handleSubmit}
              >
                Create Video
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoConfigUI;