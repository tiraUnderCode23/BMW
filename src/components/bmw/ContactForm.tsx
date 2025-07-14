import React, { useState } from 'react';
import { sendToWebhook, sendEmail } from '../../utils/webhookService.ts';

interface ContactFormProps {
  selectedModel: string;
  selectedYear: string;
  selectedGeneration: string;
  selectedActivations: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({
  selectedModel,
  selectedYear,
  selectedGeneration,
  selectedActivations
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // تجهيز البيانات للإرسال
      const formData = {
        name,
        phone,
        email,
        message,
        carDetails: {
          model: selectedModel,
          year: selectedYear,
          generation: selectedGeneration
        },
        selectedActivations
      };

      // إرسال البيانات إلى الويب هوك
      const webhookSuccess = await sendToWebhook(formData);
      
      // إرسال البيانات إلى البريد الإلكتروني
      const emailSuccess = await sendEmail(formData);
      
      console.log('نتيجة إرسال الويب هوك:', webhookSuccess);
      console.log('نتيجة إرسال البريد الإلكتروني:', emailSuccess);
      
      // تعيين حالة النجاح إذا نجح أحد الإرسالين على الأقل
      if (webhookSuccess || emailSuccess) {
        setSubmitStatus('success');
        
        // إعادة تعيين النموذج بعد النجاح
        setTimeout(() => {
          setName('');
          setPhone('');
          setEmail('');
          setMessage('');
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
      
    } catch (error) {
      console.error('خطأ في إرسال النموذج:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-500 transition-all hover:shadow-blue-500/20 hover:shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        طلب التفعيلات المختارة
      </h3>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30 animate-fadeIn">
          <p className="text-green-300 text-center">
            تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">الاسم</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل رقم هاتفك"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@domain.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">ملاحظات إضافية</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أي ملاحظات أو استفسارات إضافية"
            />
          </div>
          
          {selectedActivations.length > 0 && (
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
              <h4 className="text-sm font-medium text-gray-300 mb-2">التفعيلات المختارة:</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedActivations.map((activation, index) => (
                  <li key={index} className="text-blue-300 text-sm">{activation}</li>
                ))}
              </ul>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/30">
              <p className="text-red-300 text-sm text-center">
                حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || selectedActivations.length === 0}
            className={`w-full py-2 px-4 rounded-md transition flex items-center justify-center ${
              isSubmitting || selectedActivations.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإرسال...
              </span>
            ) : (
              'إرسال الطلب'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
