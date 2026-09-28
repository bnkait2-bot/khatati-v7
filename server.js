const express=require('express');
const cors=require('cors');
const {GoogleGenAI}=require('@google/genai');
const app=express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
const PORT=process.env.PORT||8080;
const API_KEY=process.env.GEMINI_API_KEY;
const MODEL=process.env.GEMINI_MODEL||'gemini-2.5-flash';
app.get('/health',(req,res)=>res.json({ok:true,service:'khatati-ai',model:MODEL,online:true}));
app.post('/api/ask',async(req,res)=>{
 try{
  if(!API_KEY)return res.status(503).json({error:'لم يتم إعداد GEMINI_API_KEY على الخادم.'});
  const q=String(req.body?.question||'').trim();
  if(!q)return res.status(400).json({error:'السؤال فارغ.'});
  const level=String(req.body?.level||'').trim();
  const style=String(req.body?.style||'مفصل').trim();
  const context=String(req.body?.context||'').slice(0,120000);
  const ai=new GoogleGenAI({apiKey:API_KEY});
  const prompt=`أنت مساعد تعليمي عربي داخل تطبيق "خطاطتي". أجب عن سؤال الطالب إجابة حقيقية وواضحة باللغة العربية. لا تخترع مصادر. استخدم البحث في الويب عندما يكون السؤال يحتاج معلومات حديثة أو تحققًا. رتّب الإجابة بعناوين ونقاط وأمثلة عند الحاجة. المستوى الدراسي: ${level||'عام'}. أسلوب الإجابة: ${style}. محتوى إضافي من الطالب إن وجد: ${context||'لا يوجد'}\n\nسؤال الطالب:\n${q}`;
  const response=await ai.models.generateContent({
   model:MODEL,
   contents:prompt,
   config:{
    tools:[{googleSearch:{}}],
    temperature:0.3,
    systemInstruction:'كن دقيقًا، تعليميًا، واذكر حدود المعرفة أو عدم اليقين عند الحاجة. عند استخدام البحث اعتمد على المصادر الظاهرة في الاستشهادات.'
   }
  });
  const text=response.text||'تعذر توليد إجابة.';
  res.json({ok:true,answer:text,citations:response.candidates?.[0]?.groundingMetadata||null});
 }catch(e){
  console.error(e);
  res.status(500).json({error:'حدث خطأ في محرك الذكاء الاصطناعي.',detail:process.env.NODE_ENV==='development'?String(e):undefined});
 }
});
app.listen(PORT,()=>console.log('Khatati AI server listening on '+PORT));