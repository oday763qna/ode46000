import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Image as ImageIcon, Copy, RefreshCw, Wand2, Scissors, 
  Check, X, ChevronRight, Instagram, Megaphone, Mail, FileText, 
  ShoppingBag, User, Globe, Zap, Briefcase, Smile, Flame, Building2, 
  BrainCircuit, ShieldCheck, History, Download, LayoutTemplate, 
  Trash2, Heart, MessageCircle, Send, Bookmark, AlignRight
} from 'lucide-react';

const typeLabels: Record<string, string> = {
  instagram: 'منشور إنستغرام',
  ad: 'إعلان تسويقي',
  email: 'بريد إلكتروني',
  article: 'مقال بلوغ',
  product: 'وصف منتج',
  bio: 'نبذة شخصية'
};

const placeholders: Record<string, string> = {
  instagram: 'مثال: منشور إنستغرام لإطلاق مطعم شاورما جديد في الرياض، التركيز على الجودة والطعم الأصيل...',
  ad: 'مثال: إعلان لتطبيق توصيل يستهدف الشباب في مصر والخليج، مع عرض خاص لفترة محدودة...',
  email: 'مثال: بريد ترحيبي للمشتركين الجدد في متجر إلكتروني للأزياء، مع كود خصم 15%...',
  article: 'مثال: مقال عن أهمية ريادة الأعمال للشباب العربي في 2025، مع إحصائيات ونصائح عملية...',
  product: 'مثال: وصف لهاتف ذكي متميز بكاميرا 200MP وبطارية 6000mAh، موجه لمحبي التصوير...',
  bio: 'مثال: نبذة شخصية لرائد أعمال متخصص في التقنية والابتكار، مع التركيز على الإنجازات...'
};

function getFallbackContent(type: string, userPrompt: string) {
  const demos: Record<string, string> = {
    instagram: `✨ الجودة ليست خياراً، إنها التزام!\n\n${userPrompt}\n\nنحن لا نقدم منتجاً — نحن نصنع تجربة لا تُنسى. كل تفصيلة مدروسة، كل لحظة محسوبة، كل ابتسامة مكسوبة.\n\n🔥 لأنك تستحق الأفضل دائماً!\n\n#جودة_عالية #تجربة_مميزة #عرب #إبداع #ريادة_أعمال`,
    ad: `🎯 ${userPrompt}\n\nهل أنت جاهز لتجربة مختلفة تماماً؟\n\n✅ جودة لا تُقارن بسعر لا يُصدق\n✅ خدمة عملاء متاحة 24/7 لراحتك\n✅ ضمان استرداد الأموال خلال 30 يوم\n\nانضم إلى آلاف العملاء الراضين الآن!\n👆 اضغط للتعرف على المزيد واحصل على عرضك الخاص`,
    email: `السلام عليكم ورحمة الله وبركاته،\n\nنشكركم جزيل الشكر على اهتمامكم بـ ${userPrompt}\n\nيسعدنا أن نُخبركم أننا حرصنا على تقديم أفضل تجربة ممكنة لكم. فريقنا المتخصص يعمل على مدار الساعة لضمان رضاكم التام وتحقيق أهدافكم.\n\n🎁 كهدية ترحيبية: استخدم كود <strong>OD15</strong> للحصول على خصم 15% على أول طلب.\n\nلا تترددوا في التواصل معنا في أي وقت.\n\nمع خالص التقدير,\nفريق od ✦`,
    article: `# ${userPrompt}\n\nفي عالمنا المتسارع اليوم، باتت هذه المسألة أكثر أهمية من أي وقت مضى. دعونا نغوص في التفاصيل.\n\n## 📊 الواقع الذي نعيشه\n\nيواجه كثيرون منا تحديات متزايدة في هذا المجال. لكن الفرص لا تزال موجودة لمن يعرف كيف يبحث عنها ويستثمر فيها بحكمة.\n\n## 💡 الحل الأمثل والمجرب\n\nالمفتاح يكمن في <em>التخطيط الذكي</em> و<em>التنفيذ المتقن</em>. اجمع بين الخبرة العملية والإبداع وستصل إلى نتائج مذهلة تتجاوز توقعاتك.\n\n## 🎯 خلاصة القول والعمل\n\nالنجاح رحلة مستمرة، ليس وجهة نهائية. ابدأ بخطوة صغيرة اليوم، وسترى الفرق غداً!\n\n<em>ما رأيك؟ شاركنا تجربتك في التعليقات 👇</em>`,
    product: `🌟 ${userPrompt}\n\nاكتشف منتجاً يُعيد تعريف معنى الجودة والابتكار!\n\n✨ <strong>المميزات الرئيسية:</strong>\n• أداء فائق يتجاوز توقعاتك بأضعاف\n• تصميم أنيق وعصري يعكس ذوقك الرفيع\n• متانة استثنائية تدوم لسنوات طويلة\n• ضمان شامل لراحة بالك وطمأنينتك\n• دعم فني متواصل لمساعدتك دائماً\n\n💰 <strong>بسعر تنافسي لا مثيل له!</strong>\n\n🚚 اطلب الآن واستمتع بالتوصيل المجاني خلال 24 ساعة!\n<em>الكمية محدودة — لا تفوت الفرصة!</em>`,
    bio: `${userPrompt}\n\nرائد أعمال شغوف بالابتكار والتغيير الإيجابي في العالم العربي. أؤمن بأن كل فكرة عظيمة تبدأ بخطوة صغيرة جريئة.\n\n🎓 خبرة تمتد عبر سنوات من العمل الميداني والتعلم المستمر. أجمع بين الرؤية الاستراتيجية والتنفيذ العملي لبناء مستقبل أفضل للأجيال القادمة.\n\n💼 مجالات الخبرة: ريادة الأعمال • التسويق الرقمي • تطوير المنتجات • القيادة المؤسسية\n\n✦ شغفي الحقيقي: مساعدة الآخرين على تحقيق أحلامهم وتحويل أفكارهم إلى واقع ملموس 🚀`
  };
  return demos[type] || demos.instagram;
}

interface SavedPost {
  id: string;
  type: string;
  prompt: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export default function App() {
  const [selectedType, setSelectedType] = useState('instagram');
  const [selectedTone, setSelectedTone] = useState('احترافي');
  const [selectedLength, setSelectedLength] = useState('متوسط');
  const [selectedDialect, setSelectedDialect] = useState('فصحى');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{data: string, mimeType: string, url: string} | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [isFinishedTyping, setIsFinishedTyping] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'preview'>('text');
  
  const [history, setHistory] = useState<SavedPost[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [scrolled, setScrolled] = useState(false);

  const outputTextRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('od_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const showToastMessage = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage({ data: base64String, mimeType: file.type, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveToHistory = (content: string) => {
    const newPost: SavedPost = {
      id: Date.now().toString(),
      type: selectedType,
      prompt: prompt || 'بدون عنوان',
      content: content,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      imageUrl: image?.url
    };
    const updated = [newPost, ...history].slice(0, 30); // Keep last 30
    setHistory(updated);
    localStorage.setItem('od_history', JSON.stringify(updated));
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('od_history', JSON.stringify(updated));
    showToastMessage('تم حذف المنشور من السجل');
  };

  const loadHistoryItem = (item: SavedPost) => {
    setSelectedType(item.type);
    setPrompt(item.prompt);
    setFinalText(item.content);
    setHasContent(true);
    setIsFinishedTyping(true);
    setActiveTab('text');
    if (outputTextRef.current) {
      outputTextRef.current.textContent = item.content;
    }
    if (item.imageUrl) {
      if (item.imageUrl.startsWith('data:')) {
        setImage({ data: '', mimeType: '', url: item.imageUrl });
      }
    } else {
      setImage(null);
    }
    document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' });
    showToastMessage('تم استرجاع المنشور بنجاح');
  };

  const typeWriter = (text: string) => {
    let i = 0;
    const speed = 15;
    setHasContent(true);
    setIsFinishedTyping(false);
    setFinalText('');
    setActiveTab('text');
    
    if (outputTextRef.current) {
      outputTextRef.current.textContent = '';
    }

    const type = () => {
      if (i < text.length) {
        if (outputTextRef.current) {
          outputTextRef.current.textContent += text.charAt(i);
          const outputArea = document.getElementById('outputArea');
          if (outputArea) outputArea.scrollTop = outputArea.scrollHeight;
        }
        i++;
        setTimeout(type, speed);
      } else {
        setIsGenerating(false);
        setIsFinishedTyping(true);
        setFinalText(text);
        saveToHistory(text);
      }
    };
    type();
  };

  const generateContent = async (currentPrompt = prompt) => {
    if (!currentPrompt.trim() && !image) {
      showToastMessage('⚠️ من فضلك أدخل فكرتك أو أرفق صورة', 'error');
      return;
    }

    setIsGenerating(true);
    setHasContent(false);
    setIsFinishedTyping(false);
    if (outputTextRef.current) outputTextRef.current.textContent = '';

    const lengthMap: Record<string, string> = { 'قصير': '50-80 كلمة', 'متوسط': '100-150 كلمة', 'طويل': '200-300 كلمة' };
    const systemPrompt = `أنت كاتب محتوى عربي محترف خبير في التسويق الرقمي والكتابة الإبداعية.
اكتب ${typeLabels[selectedType]} باللغة العربية.
اللهجة المطلوبة: ${selectedDialect}
النبرة المطلوبة: ${selectedTone}
الطول المطلوب: ${lengthMap[selectedLength]}
استخدم الهاشتاقات المناسبة للسوشيال ميديا عند الحاجة.
اكتب المحتوى النهائي مباشرة دون مقدمات أو شرح أو ملاحظات.`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) غير مضاف في إعدادات المنصة (Secrets).');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let contents: any;

      if (image) {
        contents = {
          parts: [
            { inlineData: { data: image.data, mimeType: image.mimeType } },
            { text: systemPrompt + '\n\nالموضوع المطلوب: ' + currentPrompt }
          ]
        };
      } else {
        contents = systemPrompt + '\n\nالموضوع المطلوب: ' + currentPrompt;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          temperature: 0.85,
          topP: 0.95
        }
      });

      if (response.text) {
        typeWriter(response.text);
      } else {
        throw new Error('استجابة فارغة');
      }
    } catch (error: any) {
      console.error('Error:', error);
      showToastMessage('⚠️ حدث خطأ: ' + error.message, 'error');
      typeWriter(getFallbackContent(selectedType, currentPrompt));
    }
  };

  const copyText = () => {
    const text = finalText || outputTextRef.current?.textContent;
    if (!text) {
      showToastMessage('⚠️ لا يوجد محتوى لنسخه', 'warning');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToastMessage('تم نسخ المحتوى بنجاح!');
    }).catch(() => {
      showToastMessage('⚠️ فشل النسخ، حاول يدوياً', 'error');
    });
  };

  const downloadText = () => {
    const text = finalText || outputTextRef.current?.textContent;
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `od_post_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToastMessage('تم تحميل الملف بنجاح!');
  };

  const improveText = () => {
    if (!prompt && !image) {
      showToastMessage('⚠️ أدخل فكرة أولاً', 'warning');
      return;
    }
    const newPrompt = prompt + ' (اجعله أكثر إقناعاً وجاذبية مع أمثلة عملية وهاشتاقات مناسبة)';
    setPrompt(newPrompt);
    generateContent(newPrompt);
    showToastMessage('جاري التحسين...');
  };

  const makeShort = () => {
    setSelectedLength('قصير');
    showToastMessage('تم ضبط الطول على: قصير');
    if (outputTextRef.current?.textContent) {
      generateContent();
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const contentTypes = [
    { id: 'instagram', icon: Instagram, label: 'منشور إنستغرام' },
    { id: 'ad', icon: Megaphone, label: 'إعلان تسويقي' },
    { id: 'email', icon: Mail, label: 'بريد إلكتروني' },
    { id: 'article', icon: FileText, label: 'مقال بلوغ' },
    { id: 'product', icon: ShoppingBag, label: 'وصف منتج' },
    { id: 'bio', icon: User, label: 'نبذة شخصية' }
  ];

  const tones = [
    { id: 'احترافي', icon: Briefcase, label: 'احترافي' },
    { id: 'ودي وقريب', icon: Smile, label: 'ودي وقريب' },
    { id: 'ملهم ومحفز', icon: Flame, label: 'ملهم ومحفز' },
    { id: 'رسمي ومؤسسي', icon: Building2, label: 'رسمي' }
  ];

  const dialects = ['فصحى', 'سعودية', 'مصرية', 'إماراتية', 'كويتية', 'شامية', 'مغربية'];

  return (
    <div className="min-h-screen relative selection:bg-purple-500/30">
      {/* Cosmic Background */}
      <div className="cosmic-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">od <span className="text-gradient-gold">للمنشورات الذكية</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#app" className="text-sm font-medium text-white/70 hover:text-white transition-colors">المنصة</a>
            <a href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">المميزات</a>
            {history.length > 0 && (
              <a href="#history" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1">
                <History className="w-4 h-4" /> السجل
              </a>
            )}
            <a href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">معلومات عنا</a>
          </div>
          <button onClick={() => document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' })} className="glass-button px-6 py-2.5 rounded-full text-sm font-bold text-white flex items-center gap-2">
            ابدأ مجاناً <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          <span className="text-sm font-medium text-white/80">أقوى منصة محتوى عربي بالذكاء الاصطناعي</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-6"
        >
          أنشئ محتوى عربياً <br />
          <span className="text-gradient-gold">استثنائياً في ثوانٍ</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed font-light"
        >
          منصة مجانية بالكامل مدعومة بأحدث نماذج الذكاء الاصطناعي تكتب لك المنشورات والإعلانات والمقالات بأسلوب احترافي يناسب جمهورك العربي بجميع لهجاته.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button onClick={() => document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(234,179,8,0.3)]">
            <Sparkles className="w-5 h-5" />
            جرّب مجاناً الآن
          </button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-button text-white font-semibold text-lg flex items-center justify-center gap-2">
            استكشف المميزات
          </button>
        </motion.div>
      </section>

      {/* App Section */}
      <section id="app" className="py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">جرّب القوة <span className="text-gradient-gold">بنفسك</span></h2>
            <p className="text-white/60 text-lg">أدخل فكرتك أو أرفق صورة، واختر نوع المحتوى وشاهد السحر يحدث</p>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
            {/* App Header */}
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-sm font-medium text-white/50 tracking-widest uppercase">od Workspace</div>
              <div className="w-12"></div> {/* Spacer for balance */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
              {/* Sidebar Controls */}
              <div className="lg:col-span-3 border-l border-white/10 bg-black/20 p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                
                {/* Content Type */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                    نوع المحتوى
                  </label>
                  <div className="flex flex-col gap-2">
                    {contentTypes.map((type) => {
                      const Icon = type.icon;
                      const isActive = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : 'text-white/40'}`} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dialect */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                    اللهجة
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dialects.map((dialect) => (
                      <button
                        key={dialect}
                        onClick={() => setSelectedDialect(dialect)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedDialect === dialect ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'}`}
                      >
                        {dialect}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                    نبرة الكتابة
                  </label>
                  <div className="flex flex-col gap-2">
                    {tones.map((tone) => {
                      const Icon = tone.icon;
                      const isActive = selectedTone === tone.id;
                      return (
                        <button
                          key={tone.id}
                          onClick={() => setSelectedTone(tone.id)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' : 'text-white/60 hover:bg-white/5 border border-transparent'}`}
                        >
                          <Icon className="w-4 h-4" />
                          {tone.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                    طول المحتوى
                  </label>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <input
                      type="range"
                      min="1" max="3" step="1"
                      value={selectedLength === 'قصير' ? 1 : selectedLength === 'متوسط' ? 2 : 3}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSelectedLength(val === 1 ? 'قصير' : val === 2 ? 'متوسط' : 'طويل');
                      }}
                    />
                    <div className="flex justify-between text-[10px] text-white/40 mt-3 font-bold px-1">
                      <span>قصير</span>
                      <span>متوسط</span>
                      <span>طويل</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Main Area */}
              <div className="lg:col-span-9 p-6 lg:p-8 flex flex-col gap-6 relative">
                
                {/* Input Area */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    أخبرنا عن محتواك أو أرفق صورة
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={placeholders[selectedType] || placeholders.instagram}
                      className="w-full h-32 glass-input rounded-2xl p-5 text-sm leading-relaxed resize-none"
                    ></textarea>
                    
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="imageUpload" 
                        ref={fileInputRef}
                        onChange={handleImageUpload} 
                      />
                      <button 
                        onClick={() => document.getElementById('imageUpload')?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/70 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        إرفاق صورة
                      </button>
                      {image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                          <img src={image.url} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={removeImage} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button 
                  onClick={() => generateContent()}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  {isGenerating ? (
                    <><div className="spinner"></div> جاري الإبداع...</>
                  ) : (
                    <><Wand2 className="w-5 h-5" /> توليد المحتوى بالذكاء الاصطناعي</>
                  )}
                </button>

                {/* Output Area */}
                <div className="flex-1 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[300px]" id="outputArea">
                  {isGenerating && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-500 animate-[loadingSlide_2s_linear_infinite] bg-[length:200%_100%]"></div>}
                  
                  {/* Tabs for Raw Text vs Preview */}
                  {(hasContent || isGenerating) && (
                    <div className="flex gap-4 border-b border-white/10 mb-4 relative z-20">
                      <button 
                        onClick={() => setActiveTab('text')} 
                        className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'text' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-white/50 hover:text-white/80'}`}
                      >
                        <AlignRight className="w-4 h-4" /> النص الخام
                      </button>
                      <button 
                        onClick={() => setActiveTab('preview')} 
                        disabled={isGenerating}
                        className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'preview' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed'}`}
                      >
                        <LayoutTemplate className="w-4 h-4" /> معاينة حية
                      </button>
                    </div>
                  )}

                  {!hasContent && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-40">
                      <BrainCircuit className="w-16 h-16 mb-4 text-white/50" />
                      <p className="text-lg font-medium">المحتوى الإبداعي سيظهر هنا...</p>
                      <p className="text-sm mt-2">أدخل فكرتك واضغط "توليد" للبدء</p>
                    </div>
                  )}

                  <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {activeTab === 'text' ? (
                      <div ref={outputTextRef} className="text-base leading-[2.2] text-white/90 whitespace-pre-wrap font-light"></div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white text-black rounded-2xl max-w-sm mx-auto overflow-hidden shadow-2xl"
                        dir="rtl"
                      >
                        {/* Social Media Card Header */}
                        <div className="flex items-center p-3 gap-3 border-b border-gray-100">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px]">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold leading-tight">od_user</div>
                            <div className="text-[10px] text-gray-500">برعاية</div>
                          </div>
                        </div>
                        
                        {/* Image Area */}
                        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center relative">
                          {image ? (
                            <img src={image.url} className="w-full h-full object-cover" alt="Post visual" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                              <span className="text-xs font-medium opacity-50">مساحة الصورة</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex gap-4">
                            <Heart className="w-6 h-6 text-gray-800 hover:text-red-500 cursor-pointer transition-colors" />
                            <MessageCircle className="w-6 h-6 text-gray-800 cursor-pointer" />
                            <Send className="w-6 h-6 text-gray-800 cursor-pointer" />
                          </div>
                          <Bookmark className="w-6 h-6 text-gray-800 cursor-pointer" />
                        </div>
                        
                        {/* Post Text */}
                        <div className="px-4 pb-5 text-sm whitespace-pre-wrap leading-relaxed">
                          <span className="font-bold ml-2">od_user</span>
                          {finalText}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isFinishedTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pt-6 mt-4 border-t border-white/10 flex flex-wrap gap-3 relative z-20"
                      >
                        <button onClick={copyText} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors text-sm font-medium">
                          <Copy className="w-4 h-4" /> نسخ المحتوى
                        </button>
                        <button onClick={downloadText} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm font-medium">
                          <Download className="w-4 h-4" /> تحميل كملف
                        </button>
                        <button onClick={() => generateContent()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                          <RefreshCw className="w-4 h-4" /> إعادة صياغة
                        </button>
                        <button onClick={improveText} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                          <Sparkles className="w-4 h-4" /> تحسين ذكي
                        </button>
                        <button onClick={makeShort} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                          <Scissors className="w-4 h-4" /> تلخيص
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {hasContent && <div className="output-glow"></div>}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      {history.length > 0 && (
        <section id="history" className="py-16 px-6 relative z-10 bg-black/30 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <History className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-bold">سجل <span className="text-gradient-gold">المنشورات</span></h2>
                  <p className="text-white/50 text-sm mt-1">محفوظاتك السابقة جاهزة للاستخدام في أي وقت</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {history.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel p-6 rounded-2xl flex flex-col h-64 group hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-white/80">
                          {typeLabels[item.type] || item.type}
                        </span>
                        <span className="text-[10px] text-white/40">{item.date}</span>
                      </div>
                      <button 
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-white/30 hover:text-red-400 transition-colors p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h4 className="font-bold text-white/90 mb-2 line-clamp-1">{item.prompt}</h4>
                    <p className="text-sm text-white/50 line-clamp-4 flex-1 whitespace-pre-wrap">
                      {item.content}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                      <button 
                        onClick={() => loadHistoryItem(item)}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                      >
                        استرجاع
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.content);
                          showToastMessage('تم النسخ من السجل!');
                        }}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                        title="نسخ"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">لماذا <span className="text-gradient-gold">od؟</span></h2>
            <p className="text-white/60 text-lg">أدوات ذكية مصممة خصيصاً للمحتوى العربي</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BrainCircuit, title: 'ذكاء اصطناعي متقدم', desc: 'مدعوم بأحدث نماذج Gemini AI من Google، مُدرّب خصيصاً لفهم اللهجات العربية المختلفة.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { icon: Zap, title: 'توليد فائق السرعة', desc: 'احصل على محتوى احترافي في ثوانٍ معدودة. لا انتظار، لا تأخير، مباشرة إلى النتيجة.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: Globe, title: 'لهجات عربية متعددة', desc: 'تحدث بلغة جمهورك! ادعم الفصحى، السعودية، المصرية، الإماراتية، الشامية، وغيرها.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { icon: ImageIcon, title: 'من صورة إلى محتوى', desc: 'أرفق صورة لمنتجك، وسيقوم الذكاء الاصطناعي بتحليلها وكتابة محتوى إبداعي متكامل عنها.', color: 'text-pink-400', bg: 'bg-pink-500/10' },
              { icon: ShieldCheck, title: 'مجاني تماماً', desc: 'لا بطاقة ائتمان، لا قيود مخفية. استخدم المنصة بالكامل مجاناً وبلا حدود.', color: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: Wand2, title: 'أدوات تحرير ذكية', desc: 'نسخ، إعادة توليد، تحسين، واختصار — تحكم كامل في مخرجاتك بنقرة واحدة.', color: 'text-orange-400', bg: 'bg-orange-500/10' }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-8 rounded-3xl group hover:border-white/20 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative z-10 bg-black/20 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">معلومات <span className="text-gradient-gold">عنا</span></h2>
            <p className="text-white/60 text-lg mb-12">تعرف على المطور وراء منصة od للمنشورات الذكية</p>
            
            <div className="glass-panel p-8 md:p-12 rounded-3xl inline-block text-right w-full md:w-auto border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full"></div>
              
              <div className="relative z-10 flex flex-col items-center md:items-start gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center md:text-right">
                    <h3 className="text-3xl font-bold text-white mb-1">oday qutqut</h3>
                    <p className="text-yellow-400 font-medium">المطور والمؤسس</p>
                  </div>
                </div>
                
                <div className="w-full h-[1px] bg-white/10"></div>
                
                <div className="flex items-center gap-4 text-white/80 bg-white/5 p-5 rounded-2xl border border-white/10 w-full hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-yellow-400" />
                  </div>
                  <a href="mailto:oday5qutqut@gmail.com" className="text-lg hover:text-yellow-400 transition-colors break-all">
                    oday5qutqut@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-12 px-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="font-display font-bold text-xl text-white">od <span className="text-gradient-gold">للمنشورات الذكية</span></span>
        </div>
        <p className="text-white/50 text-sm mb-8">منصة المحتوى العربي المدعومة بالذكاء الاصطناعي</p>
        <div className="flex justify-center gap-4 mb-8">
          {['Twitter', 'LinkedIn', 'GitHub', 'Email'].map((social) => (
            <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors">
              <span className="text-xs">{social[0]}</span>
            </a>
          ))}
        </div>
        <p className="text-white/30 text-xs">© 2026 od للمنشورات الذكية. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 
              toast.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200' : 
              'bg-green-500/20 border-green-500/30 text-green-200'
            }`}
          >
            {toast.type === 'error' ? <X className="w-5 h-5" /> : 
             toast.type === 'warning' ? <Sparkles className="w-5 h-5" /> : 
             <Check className="w-5 h-5" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
