// تكامل الويب هوك وإرسال البريد الإلكتروني
const sendToWebhook = async (data) => {
  try {
    // يمكن استبدال هذا برابط الويب هوك الحقيقي
    const webhookUrl = 'https://webhook.site/your-webhook-id';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في إرسال البيانات إلى الويب هوك:', error);
    return false;
  }
};

// إرسال البريد الإلكتروني
const sendEmail = async (data) => {
  try {
    // يمكن استبدال هذا بخدمة بريد إلكتروني حقيقية مثل EmailJS
    const emailServiceUrl = 'https://api.emailjs.com/api/v1.0/email/send';
    const emailData = {
      service_id: 'your_service_id',
      template_id: 'your_template_id',
      user_id: 'your_user_id',
      template_params: {
        to_email: 'a.3cx.92@gmail.com',
        from_name: data.name,
        from_email: data.email,
        from_phone: data.phone,
        message: `
          طلب تفعيلات BMW
          
          الاسم: ${data.name}
          رقم الهاتف: ${data.phone}
          البريد الإلكتروني: ${data.email}
          
          تفاصيل السيارة:
          الطراز: ${data.carDetails.model}
          السنة: ${data.carDetails.year}
          الجيل: ${data.carDetails.generation}
          
          التفعيلات المطلوبة:
          ${data.selectedActivations.join('\n')}
          
          ملاحظات إضافية:
          ${data.message || 'لا توجد ملاحظات'}
        `
      }
    };
    
    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error);
    return false;
  }
};

// تصدير الدوال
export { sendToWebhook, sendEmail };
