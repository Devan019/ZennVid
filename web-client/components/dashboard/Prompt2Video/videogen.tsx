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
import Videomotion from '@/components/videomotion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const data = {
  "images": [
    "https://res.cloudinary.com/dpnae0bod/image/upload/v1754571443/zennvid/image_0.png",
    "https://res.cloudinary.com/dpnae0bod/image/upload/v1754571466/zennvid/image_1.png",
    "https://res.cloudinary.com/dpnae0bod/image/upload/v1754571481/zennvid/image_2.png",
    "https://res.cloudinary.com/dpnae0bod/image/upload/v1754571497/zennvid/image_3.png",
    "https://res.cloudinary.com/dpnae0bod/image/upload/v1754571511/zennvid/image_4.png"
  ],
  "audio": "https://res.cloudinary.com/dpnae0bod/video/upload/v1754571526/zennvid/audio.mp3",
  "captions": [
    {
      "index": 1,
      "start": 0,
      "end": 4560.000000000001,
      "text": "A blue-white banner had a storm"
    },
    {
      "index": 2,
      "start": 4560.000000000001,
      "end": 8620.000000000002,
      "text": "A嗎uness which raised a slain vibe"
    },
    {
      "index": 3,
      "start": 8620.000000000002,
      "end": 11660,
      "text": "The one who were yellowish-like"
    },
    {
      "index": 4,
      "start": 11660,
      "end": 16160,
      "text": "The one who were so beautiful"
    },
    {
      "index": 5,
      "start": 16160,
      "end": 22840,
      "text": "said to watch the crowd"
    },
    {
      "index": 6,
      "start": 22840,
      "end": 25720,
      "text": "If a threat of one inch looks ugly"
    },
    {
      "index": 7,
      "start": 25720,
      "end": 29720,
      "text": "He was a very good man."
    },
    {
      "index": 8,
      "start": 29720,
      "end": 31720,
      "text": "He was a very good man."
    },
    {
      "index": 9,
      "start": 31720,
      "end": 33720,
      "text": "He was a very good man."
    },
    {
      "index": 10,
      "start": 33720,
      "end": 35720,
      "text": "He was a very good man."
    },
    {
      "index": 11,
      "start": 35720,
      "end": 37720,
      "text": "He was a very good man."
    },
    {
      "index": 12,
      "start": 37720,
      "end": 39720,
      "text": "He was a very good man."
    },
    {
      "index": 13,
      "start": 39720,
      "end": 41720,
      "text": "He was a very good man."
    },
    {
      "index": 14,
      "start": 41720,
      "end": 43720,
      "text": "He was a very good man."
    },
    {
      "index": 15,
      "start": 43720,
      "end": 45720,
      "text": "He was a very good man."
    },
    {
      "index": 16,
      "start": 45720,
      "end": 47720,
      "text": "He was a very good man."
    },
    {
      "index": 17,
      "start": 47720,
      "end": 49720,
      "text": "He was a very good man."
    },
    {
      "index": 18,
      "start": 49720,
      "end": 51720,
      "text": "He was a very good man."
    },
    {
      "index": 19,
      "start": 51720,
      "end": 53720,
      "text": "He was a very good man."
    }
  ]
}

const VideoConfigUI = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLength, setVideoLength] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState('');
  const [voiceGender, setVoiceGender] = useState('');
  const [language, setLanguage] = useState<VoiceBaseLanguage>(VoiceBaseLanguage.EnglishIndia);
  const [videoloading, setvideoloading] = useState(false);

  const videoGenMutation = useMutation({
    mutationFn: async () => {
      if (!videoTitle || !videoLength || !selectedStyle || !voiceLanguage || !voiceGender) {
        throw new Error('All fields are required');
      }
      setvideoloading(true)
      const data = await videoGen({
        title: videoTitle,
        style: selectedStyle,
        voiceGender,
        voiceLanguage,
        seconds: videoLength === '30' ? 30 : 60,
        language
      });
      setvideoloading(false)
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const handleSubmit = () => {
    // videoGenMutation.mutateAsync();
  };
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

  useEffect(() => {
    setLanguage(VoiceBaseLanguage[voiceLanguage as keyof typeof VoiceBaseLanguage] || VoiceBaseLanguage.EnglishIndia);
  }, [voiceLanguage])

  if (videoloading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Generating Video...</h2>
          <p className="text-gray-600">Please wait while we create your video.</p>
        </div>
      </div>
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

        <Dialog open={true} >
          <DialogContent className="w-auto h-[680px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Video Preview
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground mb-4">
                Preview and See in your videos
              </DialogDescription>
            </DialogHeader>

            <div className="">
              <Videomotion
                images={data.images}
                audioUrl={data.audio}
                captions={data.captions}
              />
              <Button
                variant={"destructive"}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
                size={"lg"}

              >
                Export
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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