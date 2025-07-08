
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Mic, Square, Circle } from 'lucide-react';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
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

  const handleRecord = async () => {
    if (!faceDetected) return;

    setIsRecording(true);
    
    // Симуляция записи 5 секунд
    setTimeout(() => {
      setIsRecording(false);
      
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
    }, 5000);
  };

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
                    disabled={!faceDetected || isRecording}
                    size="lg"
                    className={`px-8 py-4 text-lg font-semibold transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : faceDetected 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Запись... ({5}с)
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
