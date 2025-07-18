
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Mic, Square, Circle, Settings, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoRecordingScreenProps {
  onComplete: () => void;
}

const questions = [
  "На какие цели вы планируете потратить деньги?",
  "Какой у вас опыт работы в данной сфере?",
  "Как вы планируете возвращать кредит?"
];

const VideoRecordingScreen: React.FC<VideoRecordingScreenProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [hint, setHint] = useState("Разместите лицо в центре овала");
  const [countdown, setCountdown] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>();
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    getDevices();
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      // Filter out devices with empty deviceIds
      const audioInputs = devices.filter(device => 
        device.kind === 'audioinput' && device.deviceId && device.deviceId.trim() !== ''
      );
      const videoInputs = devices.filter(device => 
        device.kind === 'videoinput' && device.deviceId && device.deviceId.trim() !== ''
      );
      
      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);
      
      if (audioInputs.length > 0 && !selectedAudioDevice) {
        setSelectedAudioDevice(audioInputs[0].deviceId);
      }
      if (videoInputs.length > 0 && !selectedVideoDevice) {
        setSelectedVideoDevice(videoInputs[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting devices:', error);
    }
  };

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: { 
          width: 640, 
          height: 480,
          deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined
        },
        audio: {
          deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
        
        // Симуляция детекции лица
        setTimeout(() => {
          setFaceDetected(true);
          setHint("Отлично! Теперь можно начать запись");
        }, 2000);
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      toast({
        title: "Ошибка доступа к камере",
        description: "Пожалуйста, разрешите доступ к камере и микрофону",
        variant: "destructive"
      });
    }
  };

  const startCountdown = () => {
    if (!faceDetected) return;
    
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(30); // 30 секунд на ответ
    
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    if (currentQuestion < questions.length - 1) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setShowTransition(false);
        setFaceDetected(false);
        setHint("Разместите лицо в центре овала");
        
        // Повторная "детекция" лица для следующего вопроса
        setTimeout(() => {
          setFaceDetected(true);
          setHint("Отлично! Можно отвечать на следующий вопрос");
        }, 1500);
      }, 2000);
    } else {
      // Завершение всех вопросов
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startCountdown();
    }
  };

  useEffect(() => {
    if (selectedAudioDevice || selectedVideoDevice) {
      startCamera();
    }
  }, [selectedAudioDevice, selectedVideoDevice]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getHintStyle = () => {
    if (faceDetected) return "text-green-600 bg-green-50 border-green-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getOvalStyle = () => {
    if (faceDetected) return "border-green-500 shadow-green-200";
    return "border-red-500 shadow-red-200";
  };

  if (showTransition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center shadow-lg animate-fade-in">
          <CardContent>
            <div className="text-2xl font-semibold text-gray-800 mb-4">
              Запись окончена. Переходим к {currentQuestion === 0 ? 'второму' : 'третьему'} вопросу
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Прогресс-бар */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            {questions.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  index <= currentQuestion ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < questions.length - 1 && (
                  <div className={`w-32 h-1 mx-2 ${
                    index < currentQuestion ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Рекомендации по позиционированию */}
        <Card className="mb-6 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-blue-600">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Рекомендации по позиционированию</h3>
                  <p className="text-sm text-gray-600">Убедитесь, что ваше лицо четко видно в овале</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeviceSettings(!showDeviceSettings)}
                className="flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Настройки</span>
              </Button>
            </div>
            
            {showDeviceSettings && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Камера</label>
                  <Select value={selectedVideoDevice} onValueChange={setSelectedVideoDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите камеру" />
                    </SelectTrigger>
                    <SelectContent>
                      {videoDevices.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Камера ${device.deviceId.slice(0, 8)}...`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Микрофон</label>
                  <Select value={selectedAudioDevice} onValueChange={setSelectedAudioDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите микрофон" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioDevices.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Микрофон ${device.deviceId.slice(0, 8)}...`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Видео область */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Овал для лица */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className={`border-4 rounded-full transition-all duration-300 ${getOvalStyle()}`}
                      style={{ width: '280px', height: '350px' }}
                    />
                  </div>

                  {/* Счетчик обратного отсчета */}
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-white text-6xl font-bold animate-pulse">
                        {countdown}
                      </div>
                    </div>
                  )}

                  {/* Таймер записи */}
                  {isRecording && recordingTime > 0 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono font-bold">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  {/* Статус камеры */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      cameraReady ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      <Camera size={12} />
                      <span>{cameraReady ? 'Активно' : 'Подключение...'}</span>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                      <Mic size={12} />
                      <span>Активно</span>
                    </div>
                  </div>

                  {/* Индикатор записи */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                      <Circle className="w-3 h-3 fill-current animate-pulse" />
                      <span className="text-sm font-medium">Запись</span>
                    </div>
                  )}
                </div>

                {/* Кнопка записи */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleRecord}
                    disabled={(!faceDetected && !isRecording) || countdown > 0}
                    size="lg"
                    className={`px-8 py-4 text-lg font-semibold transition-all duration-200 ${
                      countdown > 0
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : isRecording 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : faceDetected 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Запись начнется через {countdown}с
                      </>
                    ) : isRecording ? (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Остановить запись
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 mr-2" />
                        {faceDetected ? 'Начать запись' : 'Позиционируйте лицо'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Панель вопросов и подсказок */}
          <div className="space-y-6">
            {/* Текущий вопрос */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Вопрос {currentQuestion + 1} из {questions.length}
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {questions[currentQuestion]}
                </p>
              </CardContent>
            </Card>

            {/* Подсказки */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Подсказки</h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border transition-all duration-200 ${getHintStyle()}`}>
                    <p className="font-medium">{hint}</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Смотрите прямо в камеру</p>
                    <p>• Убедитесь в хорошем освещении</p>
                    <p>• Ваше лицо должно помещаться в овал</p>
                    <p>• Говорите четко и спокойно</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecordingScreen;
