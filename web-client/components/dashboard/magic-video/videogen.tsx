import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Video, Palette, Languages, Users, Sparkles, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { VoiceBaseLanguage, VoiceLanguage } from '@/constants/languages';
import { videoGen } from '@/lib/apiProvider';
import { useMutation } from '@tanstack/react-query';
import VideoPreviewDialog from './downloadVideo';
import TerminalLoader from './progressLoader';
import { delay } from '@/lib/delay';


const VideoConfigUI = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLength, setVideoLength] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState('');
  const [voiceGender, setVoiceGender] = useState('');
  const [language, setLanguage] = useState<VoiceBaseLanguage>(VoiceBaseLanguage.EnglishIndia);
  const [videoloading, setvideoloading] = useState(false);
  const [dialogState, setDialogState] = useState(false)
  const [isGeneratered, setisGeneratered] = useState(false)
  const [videoUrl, setvideoUrl] = useState("");
  const [progress, setProgress] = useState({
    script: false,
    images: false,
    audio: false,
    captions: false,
    video: false,
  });
  const steps = [ 
    { id: "script" , label: "Crafting your epic storyline", duration: 30 }, 
    { id: "images" , label: "Painting vivid scenes in pixels", duration: 100 }, 
    { id: "audio" , label: "Giving voices to your story", duration: 70 }, 
    { id: "captions" , label: "Writing words on the screen", duration: 60 }, 
    { id: "video" , label: "Stitching it all into a masterpiece", duration: 500 }, 
  ];

  

  const videoGenMutation = useMutation({
    mutationFn: async () => {
      if (!videoTitle || !videoLength || !selectedStyle || !voiceLanguage || !voiceGender) {
        throw new Error('All fields are required');
      }
      setvideoloading(true)
      setisGeneratered(false)
      const data = await videoGen({
        title: videoTitle,
        style: selectedStyle,
        voiceGender,
        voiceLanguage,
        seconds: videoLength === '30' ? 30 : 60,
        language
      });
      // await delay(1000*5);
      setisGeneratered(true);
      await delay(1000 * 10);
      setvideoloading(false)

      return data;
    },
    onSuccess: (data) => {
      setvideoUrl(data.DATA.videoUrl);
      setDialogState(true);
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      setvideoloading(false);
      setProgress({
        script: false,
        images: false,
        audio: false,
        captions: false,
        video: false,
      })
    }
  })

  const handleSubmit = () => {
    videoGenMutation.mutateAsync();
  };
  const styles = [
    { id: 'realistic', name: 'Realistic', emoji: '📸', color: 'bg-blue-500' },
    { id: 'anime', name: 'Anime', emoji: '🎌', color: 'bg-pink-500' },
    { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: 'bg-yellow-500' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖', color: 'bg-purple-500' },
    { id: 'sketch', name: 'Sketch', emoji: '✏️', color: 'bg-gray-400' },
    { id: 'pixel-art', name: 'Pixel Art', emoji: '🟦', color: 'bg-green-400' }
  ];


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

  const isFormValid = () => {
    return videoTitle.trim() && videoLength && selectedStyle && voiceLanguage && voiceGender;
  };

  const OnClose = () => {
    setDialogState(false);
  }


  useEffect(() => {
    setLanguage(VoiceBaseLanguage[voiceLanguage as keyof typeof VoiceBaseLanguage] || VoiceBaseLanguage.EnglishIndia);
  }, [voiceLanguage])

  if (videoloading) {
    return (
      <TerminalLoader
        completed={isGeneratered}
        setCompleted={setisGeneratered}
        isVideoLoading={videoloading}
        steps={steps}
        progress={progress}
        setProgress={setProgress}
      />
    );
  }

  return (
    <div className="min-h-screen">
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
        </motion.div>

        <VideoPreviewDialog
          open={dialogState}
          onClose={OnClose}
          videoUrl={videoUrl}
        />
        <div className="space-y-8">
          {/* Video Title */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Video Title *
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
                    required
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
                  Video Length *
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
                  required
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${videoLength === '30'
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
                        Quick and engaging short-form content
                      </p>
                    </Label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${videoLength === '60'
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
                        Comprehensive content with detailed explanation
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
                  Visual Style *
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
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedStyle === style.id
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

          {/* Voice Language */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-green-500" />
                  Voice Language *
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
                  <Select value={voiceLanguage} onValueChange={setVoiceLanguage} required>
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
                  Voice Gender *
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
                  required
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${voiceGender === 'Male'
                      ? 'border-pink-500 bg-pink-50 text-black'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setVoiceGender('Male')}
                  >
                    <RadioGroupItem value="Male" id="Male" />
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
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${voiceGender === 'Female'
                      ? 'border-pink-500 bg-pink-50 text-black'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setVoiceGender('Female')}
                  >
                    <RadioGroupItem value="Female" id="Female" />
                    <Label htmlFor="Female" className="cursor-pointer font-medium flex-1">
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

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <Separator className="mb-6" />
            <div className="flex flex-col sm:flex-row gap-4 justify-between">

              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!isFormValid()}
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