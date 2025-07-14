import React, { useState } from 'react';

interface GeminiResponseProps {
  selectedModel: string;
  selectedYear: string;
  selectedGeneration: string;
  selectedActivations: string[];
}

const GeminiResponse: React.FC<GeminiResponseProps> = ({
  selectedModel,
  selectedYear,
  selectedGeneration,
  selectedActivations
}) => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const askGemini = async () => {
    setLoading(true);
    
    try {
      // هنا سيتم استبدال هذا بطلب API حقيقي إلى Gemini
      // لأغراض العرض، نقوم بمحاكاة استجابة من Gemini
      
      // محاكاة تأخير الاستجابة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // محاكاة استجابة Gemini
      const geminiResponses = [
        `بناءً على اختياراتك لسيارة BMW ${selectedModel} موديل ${selectedYear} ${selectedGeneration}، هذه التفعيلات ستضيف تجربة قيادة متميزة. التفعيلات المختارة ستعزز أداء السيارة وتضيف ميزات راحة وأمان إضافية. أنصح بشدة بتفعيل خاصية ${selectedActivations[0]} لأنها الأكثر تأثيراً على تجربة القيادة اليومية.`,
        
        `اختياراتك لسيارة BMW ${selectedModel} موديل ${selectedYear} ${selectedGeneration} ممتازة! هذه التفعيلات ستحول سيارتك إلى نسخة أكثر تطوراً. خاصة ${selectedActivations.length > 1 ? selectedActivations[1] : selectedActivations[0]} التي تعتبر من أكثر التفعيلات طلباً من مالكي هذا الطراز. ستلاحظ تحسناً فورياً في استجابة السيارة وميزاتها التقنية.`,
        
        `تفعيلات BMW ${selectedModel} التي اخترتها ستضيف قيمة كبيرة لسيارتك موديل ${selectedYear} ${selectedGeneration}. هذه المجموعة من التفعيلات متوافقة تماماً مع بعضها وستعمل بتناغم لتحسين أداء السيارة وراحتها. أنصح أيضاً بالنظر في إضافة تفعيل نظام الصوت المتقدم لتكملة تجربتك.`
      ];
      
      // اختيار استجابة عشوائية
      const randomResponse = geminiResponses[Math.floor(Math.random() * geminiResponses.length)];
      setResponse(randomResponse);
    } catch (error) {
      setResponse('عذراً، حدث خطأ أثناء الاتصال بـ Gemini. يرجى المحاولة مرة أخرى لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-500 transition-all hover:shadow-blue-500/20 hover:shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        استشارة Gemini الذكية
      </h3>
      
      {!response ? (
        <div className="text-center">
          <p className="text-gray-300 mb-4">احصل على تحليل ذكي للتفعيلات التي اخترتها باستخدام تقنية Gemini AI</p>
          <button 
            onClick={askGemini} 
            disabled={loading || selectedActivations.length === 0}
            className={`px-4 py-2 rounded-md transition ${
              loading || selectedActivations.length === 0 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحليل...
              </span>
            ) : (
              'تحليل اختياراتي'
            )}
          </button>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30 mb-4">
            <p className="text-gray-200">{response}</p>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setResponse('')} 
              className="text-sm text-gray-400 hover:text-white transition"
            >
              تحليل جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiResponse;
