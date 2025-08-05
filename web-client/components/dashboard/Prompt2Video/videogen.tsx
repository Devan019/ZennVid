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
import { Video, Palette, Languages, Users, Sparkles, FileText, Wand2, Loader2, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { VoiceLanguage } from '@/constants/languages';
import { useMutation } from '@tanstack/react-query';
import { scriptGen } from '@/lib/apiProvider';



const VideoConfigUI = () => {
  const [step, setStep] = useState(1);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLength, setVideoLength] = useState('30');
  const [script, setScript] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [voiceLanguage, setVoiceLanguage] = useState('');
  const [voiceGender, setVoiceGender] = useState('female');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const videoGenMutation = useMutation({
    mutationFn : scriptGen,
    onSuccess : (data) => {
      // console.log(data)
    },
    onError : (error) => {
        console.log(error);
    },
  })

  const styles = [
    { id: 'realistic', name: 'Realistic', emoji: '📸', color: 'bg-blue-500' },
    { id: 'anime', name: 'Anime', emoji: '🎌', color: 'bg-pink-500' },
    { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: 'bg-yellow-500' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖', color: 'bg-purple-500' },
    { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️', color: 'bg-green-500' },
    { id: 'retro', name: 'Retro', emoji: '📼', color: 'bg-orange-500' },
    { id: 'minimalist', name: 'Minimalist', emoji: '⚪', color: 'bg-gray-500' },
    { id: 'watercolor', name: 'Watercolor', emoji: '🎭', color: 'bg-indigo-500' }
  ];

  const getMaxChars = () => {
    return videoLength === '30' ? 400 : videoLength === '60' ? 600 : 0;
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

    setIsGeneratingScript(true);
    
    const data =  await videoGenMutation.mutateAsync({
      title: videoTitle,
      style: selectedStyle,
      maxChars : getMaxChars()
    });

    setScript(data?.DATA);
    setIsGeneratingScript(false);
    
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

  const validateStep1 = () => {
    return videoTitle.trim() && videoLength && selectedStyle;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      alert('Please complete all required fields before proceeding');
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className={`min-h-screen`}>
      <motion.div
        className="mx-auto w-auto desktop:max-w-5xl desktop:mr-36 lg:max-w-4xl mr-12 xlg:float-none float-right"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Video Creator Studio
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Configure your perfect video with AI-powered customization</p>
          
          {/* Step indicator */}
          <div className="flex justify-center mt-6 mb-2">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {step === 1 ? 'Basic Configuration' : 'Advanced Settings'}
          </p>
        </motion.div>

        {step === 1 ? (
          <div className="space-y-8">
            {/* Video Title */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 backdrop-blur-sm">
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

            {/* Video Length */}
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

            {/* Visual Style */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 backdrop-blur-sm">
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

            {/* Next Step Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <Separator className="mb-6" />
              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                  onClick={nextStep}
                  disabled={!validateStep1()}
                >
                  Next Step <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Back Button */}
            <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                onClick={prevStep}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Basic Settings
              </Button>
            </motion.div>

            {/* Video Script */}
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

            {/* Voice Language */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 backdrop-blur-sm">
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
                        {Object.entries(VoiceLanguage).map((voice) => (
                          <SelectItem key={voice[0]} value={voice[0]}>
                            {voice[1]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Voice Gender */}
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
                          : 'border-gray-200 hover:border-gray-300'
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

            {/* Submit Buttons */}
            <motion.div variants={itemVariants} className="pt-4">
              <Separator className="mb-6" />
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 border-2"
                  onClick={() => console.log('Preview:', { videoTitle, videoLength, script, selectedStyle, voiceLanguage, voiceGender })}
                >
                  Preview Settings
                </Button>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-2"
                    onClick={prevStep}
                  >
                    Back
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
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VideoConfigUI;