/* ==========================================================================
   ISA HERNANDEZ PHOTO & MAKEUP LLC
   Interactive Booking & Reservation System (Bilingual ES / EN Support)
   With Cascading Personalized Questions & Instant 'Other (Write-in)' Options
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const wizard = document.querySelector('.booking-wizard-wrapper');
  if (!wizard) return;

  const steps = document.querySelectorAll('.booking-step-pane');
  const progressItems = document.querySelectorAll('.progress-step-item');
  const btnNext = document.querySelector('.btn-wizard-next');
  const btnPrev = document.querySelector('.btn-wizard-prev');
  const btnSubmit = document.querySelector('.btn-wizard-submit');
  const modal = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.btn-modal-close');
  const whatsappSendBtn = document.querySelector('.btn-whatsapp-send');
  const emailSendBtn = document.getElementById('btnBookingEmail');
  const dynamicContainer = document.getElementById('dynamicSessionContainer');

  let currentStep = 1;
  const totalSteps = steps.length;

  // Selected Booking Data Object
  const bookingData = {
    sessionKey: 'couples',
    sessionType: 'Parejas / Couple',
    selectedPackage: 'The Story (Recomendado)',

    // Primary Personalized Question & Answer
    primaryQuestionLabel: '',
    primaryQuestionId: '',
    primaryAnswer: '',
    primaryAnswerCustom: '',

    // Follow-up Conditional Question & Answer
    followUpQuestionLabel: '',
    followUpQuestionId: '',
    followUpAnswer: '',
    followUpAnswerCustom: '',

    // Backward-compatibility string
    extraOption: '',

    // Bespoke / Custom session details
    customDetails: {
      category: 'Maternidad / Embarazo (Maternity Glow)',
      categoryCustom: '',
      duration: '1.5 a 2 Horas (Sesión completa)',
      durationCustom: '',
      people: '1 a 3 personas',
      services: ['Fotografía en Alta Resolución'],
      servicesCustom: '',
      budget: '$300 - $600 USD (Estándar Estudio/Exterior)',
      visionText: ''
    },

    location: 'Estudio Phoenix (1825 E Northern Ave #273)',
    locationCustom: '',
    desiredDate: '',
    desiredTime: '10:00 AM',
    backupDate: '',
    peopleCount: '2 personas (Pareja)',
    addons: [],
    fullName: '',
    email: '',
    phone: '',
    referral: '',
    referralCustom: '',
    visionNotes: '',
    retainerAmount: '$50 USD'
  };

  // Helper for current language
  function isEnglish() {
    return (typeof currentLang !== 'undefined' && currentLang === 'en');
  }

  // Session type configs with packages and cascading contextual questions
  const sessionConfigs = {
    couples: {
      icon: 'fa-user-group',
      titleEs: 'Opciones Personalizadas para Sesión de Parejas',
      titleEn: 'Custom Options for Couples Session',
      descEs: 'Rango de Inversión: $260 – $480 USD. Selecciona tu plan de pareja:',
      descEn: 'Investment Range: $260 – $480 USD. Select your couple package:',
      packages: [
        {
          id: 'c-date',
          titleEs: 'The Date',
          titleEn: 'The Date',
          descEs: '45 min · 8 fotos editadas · 1 fondo (estudio o exteriores) · 1 outfit · Guía de poses · Entrega máx 2 semanas',
          descEn: '45 min · 8 edited photos · 1 backdrop (studio or outdoor) · 1 outfit · Posing guide · Max 2 weeks delivery'
        },
        {
          id: 'c-story',
          titleEs: 'The Story (Recomendado)',
          titleEn: 'The Story (Recommended)',
          descEs: '1 hora · 10 fotos editadas · 1 fondo (estudio o exteriores) · 2 outfits · Asesoría previa · Entrega 1.5 sem',
          descEn: '1 hour · 10 edited photos · 1 backdrop (studio or outdoor) · 2 outfits · Styling advice · 1.5 weeks delivery'
        },
        {
          id: 'c-experience',
          titleEs: 'The Experience',
          titleEn: 'The Experience',
          descEs: '1.5 hrs · 12 fotos + 3 B&W · 2 fondos (estudio y exteriores) · 2 outfits · Álbum 10x10 · Entrega exprés 3 días',
          descEn: '1.5 hrs · 12 photos + 3 B&W · 2 backdrops (studio & outdoor) · 2 outfits · 10x10 Album · 3 days rush'
        }
      ],
      primaryQuestion: {
        id: 'couple_occasion',
        labelEs: '¿Qué ocasión o momento especial celebran?',
        labelEn: 'What special occasion or moment are you celebrating?',
        options: [
          { id: 'engagement', es: 'Propuesta de compromiso sorpresa', en: 'Surprise engagement proposal' },
          { id: 'anniversary', es: 'Aniversario de novios o bodas', en: 'Couple or wedding anniversary' },
          { id: 'casual', es: 'Sesión casual de amor / Save the Date', en: 'Casual love session / Save the Date' },
          { id: 'maternity', es: 'Maternidad en pareja (Baby Glow)', en: 'Couple maternity (Baby Glow)' },
          { id: 'other', es: 'Otra ocasión (especificar...)', en: 'Other occasion (please specify...)' }
        ]
      },
      followUps: {
        engagement: {
          id: 'proposal_loc',
          labelEs: '¿Qué tipo de locación imaginas para la propuesta?',
          labelEn: 'What location type do you envision for the proposal?',
          options: [
            { es: 'Mirador / Paisaje natural (Sedona o Desierto al atardecer)', en: 'Scenic viewpoint / Nature (Sedona or Desert sunset)' },
            { es: 'Lugar íntimo o elegante en Scottsdale / Phoenix', en: 'Intimate or upscale spot in Scottsdale / Phoenix' },
            { es: 'Estudio privado con ambientación romántica', en: 'Private studio with romantic setup' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        anniversary: {
          id: 'anniv_style',
          labelEs: '¿Qué estilo o atmósfera prefieren para su recuerdo?',
          labelEn: 'What style or atmosphere do you prefer for your memories?',
          options: [
            { es: 'Atardecer dorado en el desierto (Sedona / Saguaro)', en: 'Golden sunset in the desert (Sedona / Saguaro)' },
            { es: 'Editorial minimalista en estudio privado', en: 'Minimalist editorial in private studio' },
            { es: 'Urbano elegante (Old Town Scottsdale nocturno o tarde)', en: 'Urban chic (Old Town Scottsdale night or afternoon)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        casual: {
          id: 'casual_vibe',
          labelEs: '¿Tienen una paleta de vestuario o vibra predilecta?',
          labelEn: 'Do you have a preferred wardrobe palette or vibe?',
          options: [
            { es: 'Tonos neutros tierra y estilo relajado/boho', en: 'Earthy neutrals & relaxed/boho style' },
            { es: 'De gala / Elegante y formal de noche', en: 'Gala / Elegant & formal night' },
            { es: 'Dos outfits (uno casual fresco y uno elegante)', en: 'Two outfits (one fresh casual, one elegant)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        maternity: {
          id: 'maternity_weeks',
          labelEs: '¿Cuántas semanas de embarazo tendrán para la fecha aproximada?',
          labelEn: 'How many weeks of pregnancy will you be around the photoshoot?',
          options: [
            { es: '26 a 32 semanas (Vientre formado y máxima comodidad)', en: '26 to 32 weeks (Defined belly & great comfort)' },
            { es: '33 a 36 semanas (Etapa avanzada)', en: '33 to 36 weeks (Late stage)' },
            { es: 'Menos de 24 semanas (Anuncio de embarazo)', en: 'Under 24 weeks (Pregnancy announcement)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    families: {
      icon: 'fa-people-roof',
      titleEs: 'Opciones Personalizadas para Familia & Hitos',
      titleEn: 'Custom Options for Family & Milestones',
      descEs: 'Rango de Inversión: $290 – $499 USD. Selecciona tu paquete familiar según el número de integrantes:',
      descEn: 'Investment Range: $290 – $499 USD. Select your family package:',
      packages: [
        {
          id: 'f-moments',
          titleEs: 'Moments',
          titleEn: 'Moments',
          descEs: '45 min · Máx 4 personas · 8 fotos editadas · 1 fondo (estudio o parque) · 1 outfit · Guía de poses · Entrega 2 sem',
          descEn: '45 min · Up to 4 people · 8 edited photos · 1 backdrop (studio or park) · 1 outfit · Posing guide · Max 2 weeks'
        },
        {
          id: 'f-together',
          titleEs: 'Together (Recomendado)',
          titleEn: 'Together (Recommended)',
          descEs: '1 hora · Máx 5 personas · 10 fotos editadas · 1 fondo (estudio o exterior) · 2 outfits · Asesoría · Entrega 1.5 sem',
          descEn: '1 hour · Up to 5 people · 10 edited photos · 1 backdrop (studio or outdoor) · 2 outfits · Styling advice · 1.5 weeks'
        },
        {
          id: 'f-complete',
          titleEs: 'Complete Story',
          titleEn: 'Complete Story',
          descEs: '1.5 hrs · Máx 5 personas · 12 fotos + 3 B&W · 2 fondos profesionales · 2 outfits · Álbum 10x10 · Mini video · Entrega 3 días',
          descEn: '1.5 hrs · Up to 5 people · 12 photos + 3 B&W · 2 backdrops · 2 outfits · 10x10 Album · Social video · 3 days rush'
        }
      ],
      primaryQuestion: {
        id: 'family_type',
        labelEs: '¿Qué dinámica o motivo familiar define su sesión?',
        labelEn: 'What dynamic or family milestone defines your session?',
        options: [
          { id: 'kids', es: 'Familia con niños pequeños o bebés', en: 'Family with young children or toddlers' },
          { id: 'extended', es: 'Familia extendida o multigeneracional (abuelos y nietos)', en: 'Extended or multi-generational family (grandparents & grandchildren)' },
          { id: 'pets', es: 'Sesión familiar con mascota consentida (Pet-Friendly)', en: 'Family session including beloved pet (Pet-Friendly)' },
          { id: 'seasonal', es: 'Hito anual / Retrato festivo o de temporada', en: 'Annual milestone / Seasonal or holiday portrait' },
          { id: 'other', es: 'Otra dinámica (especificar...)', en: 'Other family dynamic (please specify...)' }
        ]
      },
      followUps: {
        kids: {
          id: 'kids_pref',
          labelEs: '¿Prefieres sesión en estudio climatizado o exteriores al aire libre?',
          labelEn: 'Do you prefer climate-controlled studio or outdoor park?',
          options: [
            { es: 'Estudio climatizado (Cómodo para descansos, snacks y cambios)', en: 'Climate-controlled studio (Easy for breaks, snacks & outfit changes)' },
            { es: 'Parque natural al atardecer (Espacio para jugar y correr)', en: 'Natural park at golden hour (Space to play and run)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        extended: {
          id: 'extended_pref',
          labelEs: '¿Cómo prefieren organizar las tomas grupales?',
          labelEn: 'How would you like group shots organized?',
          options: [
            { es: 'Gran foto grupal + Retratos por cada núcleo familiar', en: 'Big group portrait + portraits for each sub-family' },
            { es: 'Foco prioritario en abuelos con todos los nietos', en: 'Main focus on grandparents with all grandchildren' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        pets: {
          id: 'pets_pref',
          labelEs: '¿Qué tipo de mascota nos acompañará y su tamaño?',
          labelEn: 'What kind of pet will be joining and what size?',
          options: [
            { es: 'Perro pequeño o mediano (acostumbrado a personas)', en: 'Small or medium dog (comfortable around people)' },
            { es: 'Perro grande o de alta energía', en: 'Large or energetic dog' },
            { es: 'Gato u otra mascota doméstica', en: 'Cat or other domestic pet' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        seasonal: {
          id: 'seasonal_pref',
          labelEs: '¿Qué concepto decorativo tienen en mente?',
          labelEn: 'What decorative concept do you have in mind?',
          options: [
            { es: 'Atemporal y elegante con fondos de atrás en tonos neutros', en: 'Timeless & elegant with neutral tone backdrops' },
            { es: 'Temática festiva o navideña con props de temporada', en: 'Festive or holiday theme with seasonal props' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    birthdays: {
      icon: 'fa-cake-candles',
      titleEs: 'Opciones de Celebración de Cumpleaños',
      titleEn: 'Birthday Celebration Options',
      descEs: 'Rango de Inversión: $225 – $460 USD. Selecciona tu paquete de cumpleaños oficial con props en estudio:',
      descEn: 'Investment Range: $225 – $460 USD. Select your birthday package:',
      packages: [
        {
          id: 'b-golden',
          titleEs: 'Golden',
          titleEn: 'Golden',
          descEs: '45 min · 8 fotos editadas · 1 fondo de estudio · Galería privada · 1 outfit · Guía poses · Entrega máx 2 semanas',
          descEn: '45 min · 8 edited photos · 1 studio backdrop · Private gallery · 1 outfit · Posing guide · Max 2 weeks delivery'
        },
        {
          id: 'b-platinum',
          titleEs: 'Platinum (Recomendado)',
          titleEn: 'Platinum (Recommended)',
          descEs: '1 hora · 10 fotos editadas · 1 fondo de estudio · 2 outfits · Asesoría previa de fotos/vestuario · Entrega 1.5 sem',
          descEn: '1 hour · 10 edited photos · 1 studio backdrop · 2 outfits · Pre-shoot styling & posing · 1.5 weeks delivery'
        },
        {
          id: 'b-diamond',
          titleEs: 'Diamond',
          titleEn: 'Diamond',
          descEs: '1.5 hrs · 12 fotos + 3 B&W · 2 fondos de estudio · 2 outfits · Moodboard · Foto impresa 8x10 · Entrega exprés 3 días',
          descEn: '1.5 hrs · 12 photos + 3 B&W · 2 studio backdrops · 2 outfits · Moodboard · 8x10 print · 3 days rush delivery'
        }
      ],
      primaryQuestion: {
        id: 'bday_age',
        labelEs: '¿Qué edad o hito de cumpleaños celebras?',
        labelEn: 'What age or milestone are you celebrating?',
        options: [
          { id: 'bday_21', es: 'Cumpleaños 18 o 21 (Juventud, glamour y estilo)', en: '18th or 21st Birthday (Youth, glam & style)' },
          { id: 'bday_milestone', es: 'Cumpleaños 30, 40 o 50 (Madurez, éxito y elegancia)', en: '30th, 40th or 50th Milestone (Confidence & elegance)' },
          { id: 'bday_kids', es: 'Cumpleaños Infantil / Smash Cake / Primer Añito', en: 'Kids Birthday / Cake Smash / 1st Year' },
          { id: 'other', es: 'Otra edad o celebración (especificar...)', en: 'Other age or celebration (please specify...)' }
        ]
      },
      followUps: {
        bday_21: {
          id: 'bday_21_props',
          labelEs: '¿Qué elementos o props deseas incorporar?',
          labelEn: 'What elements or props would you like to incorporate?',
          options: [
            { es: 'Globos de números gigantes + Copas / Confetti festivo', en: 'Giant number balloons + Champagne flute / Festive confetti' },
            { es: 'Estilo editorial tipo portada de revista chic', en: 'High-fashion editorial magazine cover style' },
            { es: 'Fondos de atrás coloridos y juego de luces de estudio', en: 'Vibrant studio backdrops & creative lighting' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        bday_milestone: {
          id: 'bday_milestone_vibe',
          labelEs: '¿Qué estética refleja mejor tu celebración personal?',
          labelEn: 'What aesthetic best reflects your celebration?',
          options: [
            { es: 'Look de gala en negro / Dorado con iluminación sofisticada', en: 'Black / Gold gala look with sophisticated lighting' },
            { es: 'Minimalista en tonos crema y textura editorial limpia', en: 'Minimalist cream tones & clean editorial texture' },
            { es: 'Sesión al atardecer exterior con vestido elegante', en: 'Golden hour outdoor session with statement dress' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        bday_kids: {
          id: 'bday_kids_theme',
          labelEs: '¿Deseas sesión con pastel (Cake Smash) o retratos formales?',
          labelEn: 'Would you like a Cake Smash session or formal portraits?',
          options: [
            { es: 'Cake Smash interactivo con props y decoración temática', en: 'Interactive Cake Smash with themed props & backdrop' },
            { es: 'Retratos dulces y formales de estudio sin pastel', en: 'Sweet & formal studio portraits without cake' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    graduations: {
      icon: 'fa-graduation-cap',
      titleEs: 'Opciones para Graduados & Seniors',
      titleEn: 'Senior & Graduation Options',
      descEs: 'Elige tu nivel de graduación para preparar los fondos de atrás y accesorios:',
      descEn: 'Select your graduation level to prepare backdrops & accessories:',
      packages: [
        {
          id: 'g-college',
          titleEs: 'Graduación Universitaria (College Senior)',
          titleEn: 'College / University Senior',
          descEs: '1 hr · Toga, estola, birrete + Outfit casual o profesional',
          descEn: '1 hr · Cap, gown, stole + Casual or professional business look'
        },
        {
          id: 'g-highschool',
          titleEs: 'High School Senior',
          titleEn: 'High School Senior',
          descEs: 'Retrato de fin de ciclo escolar · Estilo juvenil, deportes o hobbies',
          descEn: 'High school graduation portrait · Youthful style, sports/hobbies'
        },
        {
          id: 'g-postgrad',
          titleEs: 'Posgrado / Maestría / Doctorado',
          titleEn: 'Postgrad / Master / Ph.D.',
          descEs: 'Headshot académico y formal de alto nivel profesional',
          descEn: 'High-level professional and academic formal portrait'
        }
      ],
      primaryQuestion: {
        id: 'grad_level',
        labelEs: '¿Cuál es el nivel académico y tu institución?',
        labelEn: 'What is your academic level and institution?',
        options: [
          { id: 'grad_college', es: 'Universidad / College Senior (ASU, GCU, UofA, etc.)', en: 'College / University Senior (ASU, GCU, UofA, etc.)' },
          { id: 'grad_highschool', es: 'High School Senior (Preparatoria)', en: 'High School Senior' },
          { id: 'grad_postgrad', es: 'Posgrado / Maestría / Doctorado (Master / Ph.D.)', en: 'Postgraduate / Master / Ph.D.' },
          { id: 'other', es: 'Otra institución o nivel (especificar...)', en: 'Other institution or level (please specify...)' }
        ]
      },
      followUps: {
        grad_college: {
          id: 'grad_college_loc',
          labelEs: '¿Dónde te gustaría capturar tus recuerdos de graduación?',
          labelEn: 'Where would you like your graduation photos taken?',
          options: [
            { es: 'En el campus universitario (Estatua icónica, puentes, fuentes)', en: 'On campus grounds (Iconic statue, bridges, fountains)' },
            { es: 'En estudio privado (Fondo de atrás editorial formal y elegante)', en: 'In private studio (Formal & elegant editorial backdrop)' },
            { es: 'Combinado: Fotos en estudio y exteriores', en: 'Combined: Studio portraits + outdoor spots' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        grad_highschool: {
          id: 'grad_hs_props',
          labelEs: '¿Qué elementos personales o pasiones deseas destacar?',
          labelEn: 'What personal items or passions would you like to showcase?',
          options: [
            { es: 'Toga, birrete, estola y chaqueta de generación (Letterman)', en: 'Cap, gown, stole & varsity letterman jacket' },
            { es: 'Instrumento musical, uniforme deportivo o trofeos', en: 'Musical instrument, athletic uniform or trophies' },
            { es: 'Dos cambios de vestuario (uno formal y uno juvenil casual)', en: 'Two outfits (one formal senior look, one youthful casual)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        grad_postgrad: {
          id: 'grad_post_use',
          labelEs: '¿Cuál es el uso primordial de tu fotografía de posgrado?',
          labelEn: 'What is the primary use for your postgraduate portraits?',
          options: [
            { es: 'Headshot profesional formal para LinkedIn, faculty o conferencias', en: 'Formal headshot for LinkedIn, faculty page or conferences' },
            { es: 'Celebración familiar de grado con toga, birrete y muceta', en: 'Family graduation celebration with hood, tam & gown' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    weddings: {
      icon: 'fa-ring',
      titleEs: 'Paquetes de Cobertura para Bodas',
      titleEn: 'Wedding Coverage Packages',
      descEs: 'Desde bodas íntimas hasta celebraciones de gala de día completo:',
      descEn: 'From intimate elopements to full-day luxury wedding celebrations:',
      packages: [
        {
          id: 'w-elopement',
          titleEs: 'Elopement / Boda Civil Íntima (2 Horas)',
          titleEn: 'Elopement / Intimate Civil Wedding (2 Hours)',
          descEs: 'Ceremonia civil/votos + Sesión de recién casados en locación romántica',
          descEn: 'Civil ceremony/vows + Romantic newlywed portraits on location'
        },
        {
          id: 'w-halfday',
          titleEs: 'Boda Media Jornada (5 Horas)',
          titleEn: 'Half-Day Wedding (5 Hours)',
          descEs: 'Preparativos finales, ceremonia religiosa/civil, sesión de novios y brindis',
          descEn: 'Final getting ready, ceremony, bride & groom session, and initial toasts'
        },
        {
          id: 'w-fullday',
          titleEs: 'Gran Gala Cobertura Total (8 a 10 Horas)',
          titleEn: 'Full-Day Luxury Coverage (8 to 10 Hours)',
          descEs: 'Día completo con segundo fotógrafo, desde el maquillaje hasta el baile final',
          descEn: 'Full day with second shooter, from bridal makeup to the final dance'
        }
      ],
      primaryQuestion: {
        id: 'wedding_type',
        labelEs: '¿Qué formato de boda tienen planificado?',
        labelEn: 'What wedding celebration format are you planning?',
        options: [
          { id: 'elopement', es: 'Boda civil íntima o Elopement (Hasta 30 invitados)', en: 'Intimate civil wedding or Elopement (Up to 30 guests)' },
          { id: 'traditional', es: 'Boda clásica tradicional con misa y recepción (50 a 150 invitados)', en: 'Traditional wedding with ceremony & reception (50-150 guests)' },
          { id: 'luxury', es: 'Gran boda de gala / Luxury Wedding (Más de 150 invitados)', en: 'Luxury Grand Gala Wedding (150+ guests)' },
          { id: 'destination', es: 'Boda de destino en Sedona / Norte de Arizona', en: 'Destination wedding in Sedona / Northern Arizona' },
          { id: 'other', es: 'Otro formato de boda (especificar...)', en: 'Other wedding format (please specify...)' }
        ]
      },
      followUps: {
        elopement: {
          id: 'elopement_pref',
          labelEs: '¿Qué momentos son la mayor prioridad para capturar?',
          labelEn: 'Which moments are top priority to capture?',
          options: [
            { es: 'Votos y ceremonia + Sesión romántica de recién casados', en: 'Vows & ceremony + Romantic newlywed couple portraits' },
            { es: 'Juzgado civil / Jardín + Brindis íntimo con seres queridos', en: 'Courthouse / garden ceremony + Intimate toast with loved ones' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        traditional: {
          id: 'trad_venues',
          labelEs: '¿En cuántos recintos se desarrollará la boda?',
          labelEn: 'Across how many venues will the wedding take place?',
          options: [
            { es: 'Un solo recinto (Ceremonia y banquete contiguos)', en: 'Single venue (Ceremony & reception at the same property)' },
            { es: 'Dos o tres locaciones (Hotel preparativos + Iglesia + Salón)', en: 'Two or three locations (Getting ready hotel + Church + Hall)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        luxury: {
          id: 'lux_scope',
          labelEs: '¿Deseas cobertura completa de 8-10 hrs con 2 fotógrafos + Maquillaje?',
          labelEn: 'Do you want full 8-10 hrs coverage with 2 photographers + Makeup?',
          options: [
            { es: 'Sí, cobertura integral total con segundo fotógrafo y maquillaje de novia', en: 'Yes, full all-inclusive coverage with 2 shooters & bridal makeup' },
            { es: 'Cobertura de fotografía para el evento completo', en: 'Full-day event photography coverage' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        destination: {
          id: 'dest_loc',
          labelEs: '¿Cuentan ya con un recinto o permiso en Sedona?',
          labelEn: 'Do you already have a venue or Red Rock permit in Sedona?',
          options: [
            { es: 'Sí, recinto o resort reservado en Sedona / Norte de AZ', en: 'Yes, resort or private venue booked in Sedona / Northern AZ' },
            { es: 'Deseamos asesoría para elegir el mejor mirador o parque', en: 'Need location scouting advice for best scenic red rocks' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    quinceaneras: {
      icon: 'fa-crown',
      titleEs: 'Opciones para Quinceañeras & Sweet 16',
      titleEn: 'Quinceañera & Sweet 16 Options',
      descEs: 'Celebra este gran hito con fotografía de ensueño y maquillaje de estudio:',
      descEn: 'Celebrate this milestone with dream photography & studio makeup:',
      packages: [
        {
          id: 'q-pre',
          titleEs: 'Sesión de Gala Pre-Quince (Estudio & Exterior)',
          titleEn: 'Pre-Quince Gala Session (Studio & Outdoor)',
          descEs: 'Sesión exclusiva con vestido de gala, tiara, ramos y fotos casuales',
          descEn: 'Exclusive session with ballgown, tiara, bouquet & casual look'
        },
        {
          id: 'q-event',
          titleEs: 'Misa + Sesión de Gala (4 Horas)',
          titleEn: 'Church Mass + Gala Session (4 Hours)',
          descEs: 'Cobertura solemne de la bendición/misa y sesión de fotos con damas y chambelanes',
          descEn: 'Blessing/mass coverage plus portraits with court of honor'
        },
        {
          id: 'q-complete',
          titleEs: 'Cobertura Completa Quinceañera (Hasta 8 Horas)',
          titleEn: 'Full Quinceañera Experience (Up to 8 Hours)',
          descEs: 'Preparativos, sesión solemne, vals familiar, brindis y fiesta',
          descEn: 'Getting ready, portraits, family waltz, toast and party celebration'
        }
      ],
      primaryQuestion: {
        id: 'quince_type',
        labelEs: '¿Qué tipo de celebración o sesión están organizando?',
        labelEn: 'What celebration format or session are you planning?',
        options: [
          { id: 'quince_pre', es: 'Sesión de gala previa (Pre-Quince en Estudio y Exterior)', en: 'Pre-Quince photo session (Studio & Outdoor)' },
          { id: 'quince_ceremony', es: 'Cobertura de Misa / Bendición religiosa + Sesión formal', en: 'Church blessing ceremony + Formal portrait session' },
          { id: 'quince_full', es: 'Cobertura completa del Gran Día (Misa + Fiesta y Vals)', en: 'Full celebration coverage (Church + Reception & Waltz)' },
          { id: 'sweet_16', es: 'Sweet 16 con estilo editorial contemporáneo', en: 'Sweet 16 with contemporary editorial look' },
          { id: 'other', es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
        ]
      },
      followUps: {
        quince_pre: {
          id: 'quince_outfits',
          labelEs: '¿Cuántos cambios de vestuario contempla la quinceañera?',
          labelEn: 'How many outfit changes does the quinceañera have?',
          options: [
            { es: '1 vestido de gala principal con corona y ramo', en: '1 main ballgown with tiara & bouquet' },
            { es: '2 vestidos (Gala tradicional + Look moderno chic o casual)', en: '2 dresses (Traditional gala + Modern chic or casual look)' },
            { es: '3 o más vestuarios temáticos', en: '3 or more themed wardrobe changes' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        quince_full: {
          id: 'quince_court',
          labelEs: '¿Asistirá corte de honor (damas y chambelanes)?',
          labelEn: 'Will a court of honor (damas & chambelanes) participate?',
          options: [
            { es: 'Sí, corte de honor completa (fotos grupales y vals)', en: 'Yes, full court of honor (group photos & waltz)' },
            { es: 'Celebración familiar íntima enfocada en la quinceañera', en: 'Intimate family celebration focused on the quinceañera' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        sweet_16: {
          id: 'sweet_vibe',
          labelEs: '¿Qué atmósfera visual te gusta más?',
          labelEn: 'Which visual atmosphere do you like best?',
          options: [
            { es: 'Estudio glam con fondo de atrás liso e iluminación dramática', en: 'Glam studio with seamless backdrop & dramatic lighting' },
            { es: 'Exteriores urbanos dorados en Old Town Scottsdale', en: 'Urban golden hour in Old Town Scottsdale' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    branding: {
      icon: 'fa-briefcase',
      titleEs: 'Marca Personal & Retratos Profesionales',
      titleEn: 'Personal Branding & Professional Headshots',
      descEs: 'Rango de Inversión: $180 – $380 USD. Selecciona tu plan profesional:',
      descEn: 'Investment Range: $180 – $380 USD. Select your professional package:',
      packages: [
        {
          id: 'br-essential',
          titleEs: 'Essential',
          titleEn: 'Essential',
          descEs: '30 min · 6 fotos editadas · 1 fondo de estudio · 1 outfit · Guía de poses · Galería privada · Entrega máx 2 semanas',
          descEn: '30 min · 6 edited photos · 1 studio backdrop · 1 outfit · Posing guide · Private gallery · Max 2 weeks delivery'
        },
        {
          id: 'br-elevated',
          titleEs: 'Elevated (Recomendado)',
          titleEn: 'Elevated (Recommended)',
          descEs: '45 min · 8 fotos editadas · 1 fondo (estudio o locación) · 2 outfits · Guía poses · Asesoría · Entrega 1.5 sem',
          descEn: '45 min · 8 edited photos · 1 backdrop (studio or location) · 2 outfits · Posing guide · Styling advice · 1.5 weeks'
        },
        {
          id: 'br-executive',
          titleEs: 'Executive',
          titleEn: 'Executive',
          descEs: '1 hora · 10 fotos editadas · 1 fondo de estudio · 2 outfits · Asesoría previa · Logo en 5 fotos · Foto 8x10 · Entrega 3 días',
          descEn: '1 hour · 10 edited photos · 1 studio backdrop · 2 outfits · Pre-shoot advice · Logo on 5 photos · 8x10 print · 3 days rush'
        }
      ],
      primaryQuestion: {
        id: 'brand_goal',
        labelEs: '¿Cuál es el objetivo principal de tus retratos de marca?',
        labelEn: 'What is the main objective of your brand portraits?',
        options: [
          { id: 'headshots', es: 'Headshots corporativos para LinkedIn / Sitio Web / Directorio', en: 'Corporate headshots for LinkedIn / Website / Directory' },
          { id: 'personal_brand', es: 'Marca personal para emprendedores, coaches o creadores', en: 'Personal branding for entrepreneurs, coaches or creators' },
          { id: 'industry_spec', es: 'Retrato profesional médico, legal, dental o bienes raíces', en: 'Professional portrait for healthcare, legal, dental or real estate' },
          { id: 'lookbook', es: 'Lookbook de belleza / moda / fitness', en: 'Beauty / Fashion / Fitness Lookbook' },
          { id: 'other', es: 'Otra industria o meta (especificar...)', en: 'Other industry or goal (please specify...)' }
        ]
      },
      followUps: {
        headshots: {
          id: 'headshot_bg',
          labelEs: '¿Qué estilo de fondo de atrás se adapta al estándar de tu empresa?',
          labelEn: 'What backdrop style matches your company standard?',
          options: [
            { es: 'Fondo de atrás gris neutro, blanco o negro clásico', en: 'Neutral grey, clean white or classic black backdrop' },
            { es: 'Fondo de atrás con textura editorial cálida y contemporánea', en: 'Warm contemporary textured editorial backdrop' },
            { es: 'Entorno de oficina o arquitectura moderna desenfocada', en: 'Environmental office or modern architecture blur' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        personal_brand: {
          id: 'brand_variety',
          labelEs: '¿Qué tipo de tomas necesitas para tu contenido y marketing?',
          labelEn: 'What shot variety do you need for your content & marketing?',
          options: [
            { es: 'Retratos mirando a cámara + Acciones trabajando con laptop o celular', en: 'Direct gaze portraits + Working lifestyle with laptop or phone' },
            { es: 'Variedad de expresiones y poses dinámicas para redes sociales', en: 'Dynamic expressive poses for social media marketing' },
            { es: 'Integración con productos físicos o herramientas de tu oficio', en: 'Integrated with physical products or tools of your trade' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        industry_spec: {
          id: 'industry_cutout',
          labelEs: '¿Requieres entrega con fondo de atrás transparente (PNG) para anuncios o letreros?',
          labelEn: 'Do you need transparent cutout (PNG) delivery for flyers or yard signs?',
          options: [
            { es: 'Sí, recorte limpio para tarjetas de presentación, lonas y anuncios', en: 'Yes, clean cutout for business cards, billboards & signs' },
            { es: 'Solo fotografías editadas en alta resolución estándar', en: 'Standard high-resolution edited photos only' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    makeup: {
      icon: 'fa-paintbrush',
      titleEs: 'Opciones de Solo Maquillaje & Peinado Profesional',
      titleEn: 'Professional Makeup & Hair Styling Options',
      descEs: 'Maquillaje de alta durabilidad con acabado HD a prueba de luz y cámara:',
      descEn: 'Long-lasting HD makeup perfected for camera lighting & events:',
      packages: [
        {
          id: 'm-social',
          titleEs: 'Maquillaje Social de Gala',
          titleEn: 'Social Glam Event Makeup',
          descEs: 'Piel blindada, técnica de ojos según tu fisonomía y pestañas de visón 3D',
          descEn: 'Flawless longwear complexion, custom eye technique & 3D lashes'
        },
        {
          id: 'm-bridal',
          titleEs: 'Maquillaje de Novia con Prueba Previa',
          titleEn: 'Bridal Makeup with Consultation & Trial',
          descEs: 'Diseño integral del look nupcial, fijación extrema y prueba personalizada',
          descEn: 'Full bridal look design, extreme durability & personalized trial run'
        },
        {
          id: 'm-combo',
          titleEs: 'Combo Completo: Maquillaje + Peinado',
          titleEn: 'Full Combo: Makeup + Hair Styling',
          descEs: 'Maquillaje glam completo + Ondas Hollywood o Recogido editorial',
          descEn: 'Complete glam makeup + Hollywood waves or editorial updo'
        }
      ],
      primaryQuestion: {
        id: 'makeup_occasion',
        labelEs: '¿Para qué evento o propósito requieres tu servicio?',
        labelEn: 'For what event or purpose do you need your service?',
        options: [
          { id: 'event_guest', es: 'Invitada de boda, gala social o alfombra roja', en: 'Wedding guest, social gala or red carpet event' },
          { id: 'bridal_glam', es: 'Maquillaje de Novia con prueba personalizada', en: 'Bridal makeup with customized trial session' },
          { id: 'quince_makeup', es: 'Quinceañera, Sweet 16 o graduada', en: 'Quinceañera, Sweet 16 or graduate' },
          { id: 'shoot_prod', es: 'Sesión fotográfica o grabación de video profesional', en: 'Photoshoot or professional video production' },
          { id: 'other', es: 'Otra ocasión especial (especificar...)', en: 'Other special occasion (please specify...)' }
        ]
      },
      followUps: {
        event_guest: {
          id: 'guest_loc',
          labelEs: '¿Dónde prefieres recibir tu servicio de maquillaje?',
          labelEn: 'Where would you prefer to receive your makeup service?',
          options: [
            { es: 'En el estudio privado de Isa en Phoenix (Sin cargo de viaje)', en: 'At Isa\'s private studio in Phoenix (No travel fee)' },
            { es: 'A domicilio o habitación de hotel (Travel fee según millaje)', en: 'Mobile to home or hotel suite (Travel fee applies)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        bridal_glam: {
          id: 'bridal_party',
          labelEs: '¿Cuántas personas del cortejo nupcial requerirán maquillaje?',
          labelEn: 'How many people in the bridal party will require makeup?',
          options: [
            { es: 'Solo la novia (Atención 100% personalizada)', en: 'Bride only (100% dedicated focus)' },
            { es: 'Novia + 2 a 4 damas o mamás', en: 'Bride + 2 to 4 bridesmaids or mothers' },
            { es: 'Novia + 5 o más personas (requiere asistente)', en: 'Bride + 5 or more (assistant required)' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        },
        quince_makeup: {
          id: 'glam_style',
          labelEs: '¿Qué acabado de piel y estilo de maquillaje prefieres?',
          labelEn: 'What skin finish and makeup style do you prefer?',
          options: [
            { es: 'Piel luminosa de larga duración + Pestañas 3D y labios glossy/nude', en: 'Luminous longwear skin + 3D lashes & glossy/nude lips' },
            { es: 'Smokey eyes dramático o delineado de impacto', en: 'Dramatic smokey eyes or high-impact eyeliner' },
            { es: 'Efecto natural fresco pero perfeccionado para cámara', en: 'Fresh natural look perfected for camera lighting' },
            { es: 'Otra opción (especificar...)', en: 'Other option (please specify...)' }
          ]
        }
      }
    },

    custom: {
      icon: 'fa-sliders',
      titleEs: 'Configuración Exhaustiva: Sesión Personalizada / Otro Tipo',
      titleEn: 'Bespoke Configuration: Custom Session / Other Type',
      descEs: 'Cuéntanos cada detalle de tu proyecto especial para preparar una propuesta a tu medida exacta:',
      descEn: 'Tell us every detail of your unique project to craft a fully tailored proposal:'
    }
  };

  // Helper to map card index to sessionKey
  function getSessionKeyByIndex(index) {
    const keys = ['couples', 'families', 'birthdays', 'graduations', 'weddings', 'quinceaneras', 'branding', 'makeup', 'custom'];
    return keys[index] || 'couples';
  }

  // Check if an option value represents "Other / Custom"
  function isOtherOption(val) {
    if (!val) return false;
    const lower = val.toLowerCase();
    return lower.includes('otra') || lower.includes('otro') || lower.includes('other');
  }

  // 1. Render Dynamic Session Panel
  function renderDynamicSession(key) {
    if (!dynamicContainer) return;
    const en = isEnglish();
    const cfg = sessionConfigs[key] || sessionConfigs.couples;

    bookingData.sessionKey = key;

    if (key === 'custom') {
      // ULTRA-DETAILED "OTRO TIPO" FORM WITH CUSTOM WRITE-IN
      dynamicContainer.innerHTML = `
        <div class="dynamic-session-header">
          <i class="fa-solid fa-sliders"></i>
          <div>
            <h4>${en ? cfg.titleEn : cfg.titleEs}</h4>
            <p>${en ? cfg.descEn : cfg.descEs}</p>
          </div>
        </div>

        <div class="custom-detail-box">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-tag" style="margin-right: 0.4rem;"></i>
                ${en ? 'Specific Category / Theme *' : 'Temática o Categoría Específica *'}
              </label>
              <select id="customCategory" class="form-control">
                <option value="Maternidad / Embarazo (Maternity Glow)">${en ? 'Maternity / Pregnancy Glow' : 'Maternidad / Embarazo (Maternity Glow)'}</option>
                <option value="Newborn / Recién Nacido / Bebé">${en ? 'Newborn / Baby / First Days' : 'Newborn / Recién Nacido / Bebé'}</option>
                <option value="Baby Shower / Gender Reveal">${en ? 'Baby Shower / Gender Reveal' : 'Baby Shower / Revelación de Sexo'}</option>
                <option value="Bautizo / Primera Comunión">${en ? 'Baptism / First Communion' : 'Bautizo / Primera Comunión'}</option>
                <option value="Evento Corporativo / Conferencia">${en ? 'Corporate Event / Conference' : 'Evento Corporativo / Conferencia'}</option>
                <option value="Fotografía de Producto / Moda / Lookbook">${en ? 'Product / Fashion / Lookbook' : 'Fotografía de Producto / Moda / Lookbook'}</option>
                <option value="Fiesta Privada / Celebración Especial">${en ? 'Private Party / Family Celebration' : 'Fiesta Privada / Celebración Especial'}</option>
                <option value="Proyecto Artístico Único / Conceptual">${en ? 'Unique Artistic / Creative Project' : 'Proyecto Artístico Único / Conceptual'}</option>
                <option value="Otro tipo (especificar...)">${en ? 'Other type (please specify...)' : 'Otro tipo (especificar...)'}</option>
              </select>
              <div id="customCategoryOtherBox" class="dynamic-other-box" style="display: none;">
                <div class="dynamic-other-label"><i class="fa-solid fa-pen-to-square"></i> <span>${en ? 'Specify your custom theme/category:' : 'Especificar tu temática o categoría:'}</span></div>
                <input type="text" id="customCategoryOtherInput" class="form-control dynamic-other-input" placeholder="${en ? 'e.g., Anniversary Picnic, Studio Dance, Pets, etc.' : 'Ej. Picnic de aniversario, Baile de estudio, Mascotas, etc.'}" value="${bookingData.customDetails.categoryCustom || ''}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-clock" style="margin-right: 0.4rem;"></i>
                ${en ? 'Estimated Duration Needed *' : 'Duración Estimada Requerida *'}
              </label>
              <select id="customDuration" class="form-control">
                <option value="1 Hora (Sesión express)">${en ? '1 Hour (Express session)' : '1 Hora (Sesión express)'}</option>
                <option value="1.5 a 2 Horas (Sesión completa)" selected>${en ? '1.5 to 2 Hours (Standard full session)' : '1.5 a 2 Horas (Sesión completa)'}</option>
                <option value="Media Jornada (4 Horas)">${en ? 'Half Day (4 Hours)' : 'Media Jornada (4 Horas)'}</option>
                <option value="Jornada Completa (8+ Horas)">${en ? 'Full Day (8+ Hours)' : 'Jornada Completa (8+ Horas)'}</option>
                <option value="Otra duración (especificar...)">${en ? 'Other duration (specify...)' : 'Otra duración (especificar...)'}</option>
              </select>
              <div id="customDurationOtherBox" class="dynamic-other-box" style="display: none;">
                <div class="dynamic-other-label"><i class="fa-solid fa-pen-to-square"></i> <span>${en ? 'Specify your required duration:' : 'Especificar duración requerida:'}</span></div>
                <input type="text" id="customDurationOtherInput" class="form-control dynamic-other-input" placeholder="${en ? 'e.g., 3 days, 6 hours split, etc.' : 'Ej. 3 días, 6 horas divididas, etc.'}" value="${bookingData.customDetails.durationCustom || ''}">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-users" style="margin-right: 0.4rem;"></i>
                ${en ? 'Estimated Number of People *' : 'Número Estimado de Personas *'}
              </label>
              <input type="text" id="customPeople" class="form-control" value="${bookingData.customDetails.people || '1 a 3 personas'}" placeholder="${en ? 'e.g., 2 adults + 1 baby' : 'Ej. 2 adultos y 1 bebé'}">
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-hand-holding-dollar" style="margin-right: 0.4rem;"></i>
                ${en ? 'Estimated Budget Range' : 'Rango de Presupuesto Estimado'}
              </label>
              <select id="customBudget" class="form-control">
                <option value="Menos de $300 USD">${en ? 'Under $300 USD' : 'Menos de $300 USD'}</option>
                <option value="$300 - $600 USD" selected>${en ? '$300 - $600 USD (Standard Studio/Outdoor)' : '$300 - $600 USD (Estándar Estudio/Exterior)'}</option>
                <option value="$600 - $1,200 USD">${en ? '$600 - $1,200 USD (Extended/Event)' : '$600 - $1,200 USD (Extendida/Evento)'}</option>
                <option value="Más de $1,200 USD">${en ? 'Over $1,200 USD (Full Event/Commercial)' : 'Más de $1,200 USD (Evento completo/Comercial)'}</option>
                <option value="Flexible según cotización">${en ? 'Flexible / Open to quote' : 'Flexible según cotización y visión'}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-layer-group" style="margin-right: 0.4rem;"></i>
              ${en ? 'Services Required (Select all that apply):' : 'Servicios Combinados Requeridos (Marca los que apliquen):'}
            </label>
            <div class="custom-services-checklist">
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Fotografía en Alta Resolución" checked>
                <span>${en ? 'High-Res Photography' : 'Fotografía en Alta Resolución'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Maquillaje Profesional por Isa">
                <span>${en ? 'Professional Makeup by Isa' : 'Maquillaje Profesional por Isa'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Peinado Profesional">
                <span>${en ? 'Hair Styling' : 'Peinado Profesional'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Mini-video en vertical para Reels">
                <span>${en ? 'Short Video Clips for Reels' : 'Mini-video en vertical para Reels'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Client Closet / Asistencia Vestuario">
                <span>${en ? 'Client Closet / Wardrobe Help' : 'Client Closet / Asistencia Vestuario'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Entrega Prioritaria Exprés">
                <span>${en ? 'Rush Express Delivery' : 'Entrega Prioritaria Exprés'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" id="customSrvOtherChk" value="Otro requerimiento">
                <span>${en ? 'Other custom requirement' : 'Otro requerimiento a medida'}</span>
              </label>
            </div>
            <div id="customSrvOtherBox" class="dynamic-other-box" style="display: none;">
              <div class="dynamic-other-label"><i class="fa-solid fa-pen-to-square"></i> <span>${en ? 'Specify additional services needed:' : 'Especificar servicios adicionales:'}</span></div>
              <input type="text" id="customSrvOtherInput" class="form-control dynamic-other-input" placeholder="${en ? 'e.g., Drone photos, multiple locations, live preview...' : 'Ej. Fotos aéreas con dron, múltiples locaciones, vista previa en vivo...'}" value="${bookingData.customDetails.servicesCustom || ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-pen-nib" style="margin-right: 0.4rem;"></i>
              ${en ? 'Tell us in detail about your project and vision:' : 'Cuéntanos a detalle sobre tu proyecto y visión:'}
            </label>
            <textarea id="customVisionText" class="form-control" rows="3" placeholder="${en ? 'Describe your theme, color palette, inspiration references or specific requirements...' : 'Describe la temática, paleta de colores, referencias de inspiración o cualquier requerimiento específico...'}">${bookingData.customDetails.visionText || ''}</textarea>
          </div>
        </div>
      `;

      attachCustomListeners();
      bookingData.selectedPackage = en ? 'Custom Project / Bespoke' : 'Proyecto Personalizado a Medida';
      bookingData.primaryAnswer = '';
      bookingData.followUpAnswer = '';
      bookingData.extraOption = '';
    } else {
      // STANDARD SESSIONS WITH PACKAGES & CASCADING PERSONALIZED QUESTIONS
      let packagesHtml = '';
      cfg.packages.forEach((pkg, idx) => {
        const isSelected = idx === 0;
        if (isSelected) {
          bookingData.selectedPackage = en ? pkg.titleEn : pkg.titleEs;
        }
        packagesHtml += `
          <div class="dynamic-option-card ${isSelected ? 'active' : ''}" data-pkg-title="${en ? pkg.titleEn : pkg.titleEs}">
            <div class="dynamic-option-title">
              <span>${en ? pkg.titleEn : pkg.titleEs}</span>
              <i class="fa-solid fa-circle-check" style="color: ${isSelected ? 'var(--text-dark)' : '#CCC'};"></i>
            </div>
            <div class="dynamic-option-desc">
              ${en ? pkg.descEn : pkg.descEs}
            </div>
          </div>
        `;
      });

      // Build Primary Question
      const pQ = cfg.primaryQuestion;
      bookingData.primaryQuestionLabel = en ? pQ.labelEn : pQ.labelEs;
      const initialPrimaryOpt = pQ.options[0];
      bookingData.primaryQuestionId = initialPrimaryOpt.id;
      bookingData.primaryAnswer = en ? initialPrimaryOpt.en : initialPrimaryOpt.es;
      bookingData.primaryAnswerCustom = '';

      let primaryOptionsHtml = pQ.options.map(opt => `
        <option value="${opt.id}" data-text="${en ? opt.en : opt.es}">${en ? opt.en : opt.es}</option>
      `).join('');

      dynamicContainer.innerHTML = `
        <div class="dynamic-session-header">
          <i class="fa-solid ${cfg.icon}"></i>
          <div>
            <h4>${en ? cfg.titleEn : cfg.titleEs}</h4>
            <p>${en ? cfg.descEn : cfg.descEs}</p>
          </div>
        </div>

        <label class="form-label" style="margin-bottom: 0.8rem; display: block;">
          <i class="fa-solid fa-sparkles" style="margin-right: 0.4rem;"></i>
          ${en ? 'Select Package or Variation:' : 'Selecciona el Paquete o Variante:'}
        </label>
        <div class="dynamic-options-grid">
          ${packagesHtml}
        </div>

        <div class="dynamic-questions-wrapper">
          <!-- Primary Question Block -->
          <div class="dynamic-question-block" id="blockPrimaryQuestion">
            <label class="form-label" for="primaryQuestionSelect">
              <i class="fa-solid fa-circle-dot" style="margin-right: 0.4rem; color: var(--accent-terracotta);"></i>
              <span id="primaryQuestionTitle">${en ? pQ.labelEn : pQ.labelEs}</span>
            </label>
            <select id="primaryQuestionSelect" class="form-control">
              ${primaryOptionsHtml}
            </select>
            <div id="primaryOtherBox" class="dynamic-other-box" style="display: none;">
              <div class="dynamic-other-label">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>${en ? 'Specify your custom answer:' : 'Especificar tu opción personalizada:'}</span>
              </div>
              <input type="text" id="primaryOtherInput" class="form-control dynamic-other-input" placeholder="${en ? 'Write your custom option here...' : 'Escribe aquí tu opción personalizada...'}" value="">
            </div>
          </div>

          <!-- Secondary / Follow-up Conditional Question Container -->
          <div id="dynamicFollowUpContainer">
            <!-- Injected by renderFollowUpQuestion() -->
          </div>
        </div>
      `;

      attachStandardListeners();
      renderFollowUpQuestion(initialPrimaryOpt.id);
    }

    updateSummary();
  }

  // 2. Render Conditional Follow-up Question
  function renderFollowUpQuestion(primaryOptId) {
    const followUpContainer = document.getElementById('dynamicFollowUpContainer');
    if (!followUpContainer) return;
    const en = isEnglish();
    const cfg = sessionConfigs[bookingData.sessionKey];
    if (!cfg || !cfg.followUps) {
      followUpContainer.innerHTML = '';
      bookingData.followUpQuestionLabel = '';
      bookingData.followUpQuestionId = '';
      bookingData.followUpAnswer = '';
      bookingData.followUpAnswerCustom = '';
      bookingData.extraOption = bookingData.primaryAnswerCustom || bookingData.primaryAnswer;
      updateSummary();
      return;
    }

    const followUpCfg = cfg.followUps[primaryOptId];
    if (!followUpCfg) {
      // If no secondary question mapped (e.g. they chose 'other'), hide secondary question
      followUpContainer.innerHTML = '';
      bookingData.followUpQuestionLabel = '';
      bookingData.followUpQuestionId = '';
      bookingData.followUpAnswer = '';
      bookingData.followUpAnswerCustom = '';
      bookingData.extraOption = bookingData.primaryAnswerCustom || bookingData.primaryAnswer;
      updateSummary();
      return;
    }

    bookingData.followUpQuestionLabel = en ? followUpCfg.labelEn : followUpCfg.labelEs;
    bookingData.followUpQuestionId = followUpCfg.id;
    const initialFollowOpt = followUpCfg.options[0];
    bookingData.followUpAnswer = en ? initialFollowOpt.en : initialFollowOpt.es;
    bookingData.followUpAnswerCustom = '';
    bookingData.extraOption = `${bookingData.primaryAnswerCustom || bookingData.primaryAnswer} · ${bookingData.followUpAnswer}`;

    let followUpOptionsHtml = followUpCfg.options.map(opt => `
      <option value="${en ? opt.en : opt.es}">${en ? opt.en : opt.es}</option>
    `).join('');

    followUpContainer.innerHTML = `
      <div class="dynamic-question-block" id="blockFollowUpQuestion">
        <label class="form-label" for="followUpQuestionSelect">
          <i class="fa-solid fa-sliders" style="margin-right: 0.4rem; color: var(--accent-terracotta);"></i>
          <span id="followUpQuestionTitle">${en ? followUpCfg.labelEn : followUpCfg.labelEs}</span>
        </label>
        <select id="followUpQuestionSelect" class="form-control">
          ${followUpOptionsHtml}
        </select>
        <div id="followUpOtherBox" class="dynamic-other-box" style="display: none;">
          <div class="dynamic-other-label">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>${en ? 'Specify your custom answer:' : 'Especificar tu opción personalizada:'}</span>
          </div>
          <input type="text" id="followUpOtherInput" class="form-control dynamic-other-input" placeholder="${en ? 'Write your custom option here...' : 'Escribe aquí tu opción personalizada...'}" value="">
        </div>
      </div>
    `;

    attachFollowUpListeners();
    updateSummary();
  }

  // 3. Attach Listeners for Packages & Primary Question
  function attachStandardListeners() {
    const pkgCards = dynamicContainer.querySelectorAll('.dynamic-option-card');
    pkgCards.forEach(card => {
      card.addEventListener('click', () => {
        pkgCards.forEach(c => {
          c.classList.remove('active');
          const icon = c.querySelector('.dynamic-option-title i');
          if (icon) icon.style.color = '#CCC';
        });
        card.classList.add('active');
        const icon = card.querySelector('.dynamic-option-title i');
        if (icon) icon.style.color = 'var(--text-dark)';

        bookingData.selectedPackage = card.getAttribute('data-pkg-title');
        updateSummary();
      });
    });

    const primarySelect = document.getElementById('primaryQuestionSelect');
    const primaryOtherBox = document.getElementById('primaryOtherBox');
    const primaryOtherInput = document.getElementById('primaryOtherInput');

    if (primarySelect) {
      primarySelect.addEventListener('change', () => {
        const selectedOpt = primarySelect.options[primarySelect.selectedIndex];
        const optId = primarySelect.value;
        const optText = selectedOpt.getAttribute('data-text') || selectedOpt.textContent.trim();
        const en = isEnglish();

        bookingData.primaryQuestionId = optId;

        if (optId === 'other' || isOtherOption(optText)) {
          if (primaryOtherBox) primaryOtherBox.style.display = 'block';
          if (primaryOtherInput) {
            primaryOtherInput.focus();
            bookingData.primaryAnswerCustom = primaryOtherInput.value.trim();
            bookingData.primaryAnswer = primaryOtherInput.value.trim() 
              ? (en ? `Other: ${primaryOtherInput.value.trim()}` : `Otra opción: ${primaryOtherInput.value.trim()}`)
              : (en ? 'Other (Custom option)' : 'Otra opción (Personalizada)');
          }
        } else {
          if (primaryOtherBox) primaryOtherBox.style.display = 'none';
          bookingData.primaryAnswerCustom = '';
          bookingData.primaryAnswer = optText;
        }

        renderFollowUpQuestion(optId);
      });
    }

    if (primaryOtherInput) {
      primaryOtherInput.addEventListener('input', () => {
        const val = primaryOtherInput.value.trim();
        const en = isEnglish();
        bookingData.primaryAnswerCustom = val;
        bookingData.primaryAnswer = val 
          ? (en ? `Other: ${val}` : `Otra opción: ${val}`)
          : (en ? 'Other (Custom option)' : 'Otra opción (Personalizada)');
        bookingData.extraOption = bookingData.followUpAnswer 
          ? `${bookingData.primaryAnswer} · ${bookingData.followUpAnswerCustom || bookingData.followUpAnswer}`
          : bookingData.primaryAnswer;
        updateSummary();
      });
    }
  }

  // 4. Attach Listeners for Secondary Follow-up Question
  function attachFollowUpListeners() {
    const followUpSelect = document.getElementById('followUpQuestionSelect');
    const followUpOtherBox = document.getElementById('followUpOtherBox');
    const followUpOtherInput = document.getElementById('followUpOtherInput');

    if (followUpSelect) {
      followUpSelect.addEventListener('change', () => {
        const optVal = followUpSelect.value;
        const en = isEnglish();

        if (isOtherOption(optVal)) {
          if (followUpOtherBox) followUpOtherBox.style.display = 'block';
          if (followUpOtherInput) {
            followUpOtherInput.focus();
            bookingData.followUpAnswerCustom = followUpOtherInput.value.trim();
            bookingData.followUpAnswer = followUpOtherInput.value.trim()
              ? (en ? `Other: ${followUpOtherInput.value.trim()}` : `Otra opción: ${followUpOtherInput.value.trim()}`)
              : (en ? 'Other (Custom preference)' : 'Otra opción (Preferencia a medida)');
          }
        } else {
          if (followUpOtherBox) followUpOtherBox.style.display = 'none';
          bookingData.followUpAnswerCustom = '';
          bookingData.followUpAnswer = optVal;
        }

        bookingData.extraOption = `${bookingData.primaryAnswerCustom || bookingData.primaryAnswer} · ${bookingData.followUpAnswerCustom || bookingData.followUpAnswer}`;
        updateSummary();
      });
    }

    if (followUpOtherInput) {
      followUpOtherInput.addEventListener('input', () => {
        const val = followUpOtherInput.value.trim();
        const en = isEnglish();
        bookingData.followUpAnswerCustom = val;
        bookingData.followUpAnswer = val 
          ? (en ? `Other: ${val}` : `Otra opción: ${val}`)
          : (en ? 'Other (Custom preference)' : 'Otra opción (Preferencia a medida)');
        bookingData.extraOption = `${bookingData.primaryAnswerCustom || bookingData.primaryAnswer} · ${bookingData.followUpAnswer}`;
        updateSummary();
      });
    }
  }

  // 5. Attach Listeners for Custom "Otro Tipo" panel
  function attachCustomListeners() {
    const catSelect = document.getElementById('customCategory');
    const catOtherBox = document.getElementById('customCategoryOtherBox');
    const catOtherInput = document.getElementById('customCategoryOtherInput');

    const durSelect = document.getElementById('customDuration');
    const durOtherBox = document.getElementById('customDurationOtherBox');
    const durOtherInput = document.getElementById('customDurationOtherInput');

    const peopleInput = document.getElementById('customPeople');
    const budgetSelect = document.getElementById('customBudget');
    const visionArea = document.getElementById('customVisionText');

    const srvCheckboxes = dynamicContainer.querySelectorAll('.custom-srv-chk');
    const srvOtherChk = document.getElementById('customSrvOtherChk');
    const srvOtherBox = document.getElementById('customSrvOtherBox');
    const srvOtherInput = document.getElementById('customSrvOtherInput');

    function syncCustom() {
      const en = isEnglish();

      // Category sync
      if (catSelect) {
        if (isOtherOption(catSelect.value)) {
          if (catOtherBox) catOtherBox.style.display = 'block';
          bookingData.customDetails.categoryCustom = catOtherInput ? catOtherInput.value.trim() : '';
          bookingData.customDetails.category = bookingData.customDetails.categoryCustom
            ? (en ? `Other Category: ${bookingData.customDetails.categoryCustom}` : `Otra temática: ${bookingData.customDetails.categoryCustom}`)
            : (en ? 'Other Custom Theme' : 'Otra temática a medida');
        } else {
          if (catOtherBox) catOtherBox.style.display = 'none';
          bookingData.customDetails.categoryCustom = '';
          bookingData.customDetails.category = catSelect.value;
        }
      }

      // Duration sync
      if (durSelect) {
        if (isOtherOption(durSelect.value)) {
          if (durOtherBox) durOtherBox.style.display = 'block';
          bookingData.customDetails.durationCustom = durOtherInput ? durOtherInput.value.trim() : '';
          bookingData.customDetails.duration = bookingData.customDetails.durationCustom
            ? (en ? `Other: ${bookingData.customDetails.durationCustom}` : `Otra duración: ${bookingData.customDetails.durationCustom}`)
            : (en ? 'Custom Duration' : 'Duración personalizada');
        } else {
          if (durOtherBox) durOtherBox.style.display = 'none';
          bookingData.customDetails.durationCustom = '';
          bookingData.customDetails.duration = durSelect.value;
        }
      }

      bookingData.customDetails.people = peopleInput ? peopleInput.value : '';
      bookingData.customDetails.budget = budgetSelect ? budgetSelect.value : '';
      bookingData.customDetails.visionText = visionArea ? visionArea.value : '';

      // Services sync
      const activeServices = Array.from(srvCheckboxes)
        .filter(c => c.checked && c.id !== 'customSrvOtherChk')
        .map(c => c.value);

      if (srvOtherChk && srvOtherChk.checked) {
        if (srvOtherBox) srvOtherBox.style.display = 'block';
        bookingData.customDetails.servicesCustom = srvOtherInput ? srvOtherInput.value.trim() : '';
        if (bookingData.customDetails.servicesCustom) {
          activeServices.push(en ? `Custom: ${bookingData.customDetails.servicesCustom}` : `A medida: ${bookingData.customDetails.servicesCustom}`);
        } else {
          activeServices.push(en ? 'Other Custom Requirement' : 'Otro requerimiento a medida');
        }
      } else {
        if (srvOtherBox) srvOtherBox.style.display = 'none';
        bookingData.customDetails.servicesCustom = '';
      }
      bookingData.customDetails.services = activeServices;

      bookingData.selectedPackage = `${bookingData.customDetails.category} (${bookingData.customDetails.duration})`;
      bookingData.peopleCount = bookingData.customDetails.people;
      updateSummary();
    }

    if (catSelect) catSelect.addEventListener('change', syncCustom);
    if (catOtherInput) catOtherInput.addEventListener('input', syncCustom);
    if (durSelect) durSelect.addEventListener('change', syncCustom);
    if (durOtherInput) durOtherInput.addEventListener('input', syncCustom);
    if (peopleInput) peopleInput.addEventListener('input', syncCustom);
    if (budgetSelect) budgetSelect.addEventListener('change', syncCustom);
    if (visionArea) visionArea.addEventListener('input', syncCustom);
    srvCheckboxes.forEach(chk => chk.addEventListener('change', syncCustom));
    if (srvOtherInput) srvOtherInput.addEventListener('input', syncCustom);

    syncCustom();
  }

  // 6. Session Type selection cards (Step 1 grid)
  const sessionCards = document.querySelectorAll('.session-choice-card');
  sessionCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      sessionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const titleEl = card.querySelector('.choice-title');
      bookingData.sessionType = titleEl ? titleEl.textContent.trim() : (card.getAttribute('data-service') || 'Personalizada');

      const key = getSessionKeyByIndex(idx);
      renderDynamicSession(key);
    });
  });

  /* =========================================================================================
     =========================================================================================
     >>> LIVE GOOGLE CALENDAR ENGINE — MODELO OPT-IN 1:1 CON SANDY VALVAL STUDIO <<<
     =========================================================================================
     Credenciales y Calendario Oficial de Isa Hernandez Photo & Makeup LLC:
     - Calendar ID: isahernandezphotographer@gmail.com
     - API Key: AIzaSyAVBYoAGH8PEHQAcLIQJ0wvrRmSrr39nRQ
     - Zona horaria: America/Phoenix (MST / UTC-7)

     REGLA DE ORO / AVAILABILITY MODEL:
     1. Solo los días en los que Isa crea un evento que contenga "Disponibilidad" o "Disponible"
        se abren en el calendario web para los clientes (disponibilidad opt-in).
     2. Un evento de día completo ("All day") "Disponibilidad" abre los horarios estándar del estudio
        (9:00 AM – 5:00 PM en bloques de 1 hora).
     3. Un evento con horario específico (ej. 2:30 PM) abre exactamente esa franja.
     4. Cualquier otro evento en el calendario de Isa actúa como bloqueador de seguridad.
     5. Todos los demás días permanecen desactivados (gris / cal-day--off / no seleccionables).
     ========================================================================================= */

  const GOOGLE_CALENDAR_CONFIG = {
    apiKey: 'AIzaSyAVBYoAGH8PEHQAcLIQJ0wvrRmSrr39nRQ',
    calendarId: 'isahernandezphotographer@gmail.com',
    timezone: 'America/Phoenix'
  };

  const AVAILABLE_TITLE_RE = /disponib|available/i;
  const DEFAULT_DAY_START_HOUR = 9;  // Horario inicial del estudio (9:00 AM)
  const DEFAULT_DAY_END_HOUR = 17;   // Horario final del estudio (5:00 PM)

  // Convierte fecha a formato YYYY-MM-DD en la zona horaria de Phoenix
  function ymdInPhoenix(date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Phoenix', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }

  // Formatea hora en la zona horaria de Phoenix (bilingüe ES/EN)
  function formatTimeInPhoenix(date) {
    return new Intl.DateTimeFormat(isEnglish() ? 'en-US' : 'es-MX', { timeZone: 'America/Phoenix', hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  }

  let windowsByDay = {};   // { 'YYYY-MM-DD': [{start:Date, end:Date}, ...] } — Franjas de Disponibilidad
  let blockingRanges = []; // [{start:Date, end:Date}] — Eventos ocupados / bloqueos
  let calendarLoaded = false;

  async function loadAvailability() {
    try {
      // Consultar desde el 1 del mes en curso hasta 365 días en adelante
      const now = new Date();
      const startRange = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const endRange = new Date(now.getFullYear(), now.getMonth() + 12, 0, 23, 59, 59);
      const timeMin = startRange.toISOString();
      const timeMax = endRange.toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.calendarId)}/events?key=${GOOGLE_CALENDAR_CONFIG.apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Calendar fetch status: ' + res.status);
      const data = await res.json();

      windowsByDay = {};
      blockingRanges = [];

      (data.items || []).forEach(ev => {
        if (!ev.start || !(ev.start.date || ev.start.dateTime)) return;
        const isAvailable = ev.summary && AVAILABLE_TITLE_RE.test(ev.summary);
        const isAllDay = !!ev.start.date;

        if (isAvailable) {
          if (isAllDay) {
            // Evento de todo el día "Disponibilidad" -> Abre las 3 franjas: Mañana, Tarde y Noche / Atardecer
            const dayStr = ev.start.date; // 'YYYY-MM-DD'
            const sM = new Date(`${dayStr}T09:00:00-07:00`);
            const eM = new Date(`${dayStr}T12:00:00-07:00`);
            const sT = new Date(`${dayStr}T12:00:00-07:00`);
            const eT = new Date(`${dayStr}T17:00:00-07:00`);
            const sN = new Date(`${dayStr}T17:00:00-07:00`);
            const eN = new Date(`${dayStr}T19:30:00-07:00`);
            (windowsByDay[dayStr] ||= []).push(
              { periodKey: 'manana', start: sM, end: eM, labelEs: 'Mañana', labelEn: 'Morning', timeEs: '9:00 AM – 12:00 PM', timeEn: '9:00 AM – 12:00 PM', icon: 'fa-cloud-sun', noteEs: 'Luz natural suave', noteEn: 'Soft natural light' },
              { periodKey: 'tarde', start: sT, end: eT, labelEs: 'Tarde', labelEn: 'Afternoon', timeEs: '12:00 PM – 5:00 PM', timeEn: '12:00 PM – 5:00 PM', icon: 'fa-sun', noteEs: 'Estudio & Retratos', noteEn: 'Studio & Portraits' },
              { periodKey: 'noche', start: sN, end: eN, labelEs: 'Noche / Atardecer', labelEn: 'Sunset / Evening', timeEs: '5:00 PM – 7:30 PM', timeEn: '5:00 PM – 7:30 PM', icon: 'fa-mountain-sun', noteEs: 'Golden Hour ✨', noteEn: 'Golden Hour ✨' }
            );
          } else {
            // Evento con horario puntual en Google Calendar
            const start = new Date(ev.start.dateTime);
            const end = new Date(ev.end.dateTime);
            const dayStr = ymdInPhoenix(start);
            const timeStr = `${formatTimeInPhoenix(start)} – ${formatTimeInPhoenix(end)}`;
            (windowsByDay[dayStr] ||= []).push({
              periodKey: 'puntual',
              start,
              end,
              labelEs: 'Horario Programado',
              labelEn: 'Scheduled Window',
              timeEs: timeStr,
              timeEn: timeStr,
              icon: 'fa-clock',
              noteEs: 'Evento en Google Calendar',
              noteEn: 'Calendar event'
            });
          }
        } else {
          // Evento que bloquea disponibilidad
          blockingRanges.push({
            start: new Date(ev.start.date ? `${ev.start.date}T00:00:00-07:00` : ev.start.dateTime),
            end: new Date(ev.end.date ? `${ev.end.date}T23:59:59-07:00` : ev.end.dateTime),
          });
        }
      });

      calendarLoaded = true;
    } catch (err) {
      console.warn('Google Calendar availability fetch failed:', err);
      calendarLoaded = true;
    }

    renderLiveCalendar();
    if (calSelectedDateStr) {
      renderTimeSlots(calSelectedDateStr);
    }
  }

  function windowIsBlocked(w) {
    return blockingRanges.some(r => w.start < r.end && w.end > r.start);
  }

  function openWindowsForDay(ymd) {
    return (windowsByDay[ymd] || []).filter(w => !windowIsBlocked(w));
  }

  function toYmd(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  /* =========================================================================================
     GENERACIÓN DE EVENTOS EN GOOGLE CALENDAR (1-CLICK SYNC)
     ========================================================================================= */
  function buildGoogleCalendarAddUrl(booking) {
    if (!booking.desiredDate) return '#';

    const [y, m, d] = booking.desiredDate.split('-').map(Number);
    let hour = 10;
    let minute = 0;
    if (booking.desiredTime) {
      const timeMatch = booking.desiredTime.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : '';
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
      } else {
        const lower = booking.desiredTime.toLowerCase();
        if (lower.includes('mañana') || lower.includes('morning')) {
          hour = 10;
        } else if (lower.includes('tarde') || lower.includes('afternoon')) {
          hour = 14;
        } else if (lower.includes('noche') || lower.includes('atardecer') || lower.includes('sunset') || lower.includes('evening')) {
          hour = 17;
          minute = 30;
        }
      }
    }

    const startDate = new Date(Date.UTC(y, m - 1, d, hour, minute));
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // 1 hora estándar

    function formatGcalTime(dt) {
      return dt.toISOString().replace(/-|:|\.\d\d\d/g, '');
    }

    const title = encodeURIComponent(`Sesión Fotográfica ISAH: ${booking.fullName || 'Cliente'} - ${booking.sessionType || 'Fotografía'}`);
    const details = encodeURIComponent(
      `Sesión fotográfica con Isa Hernandez Photo & Makeup LLC.\n\n` +
      `Paquete: ${booking.selectedPackage || 'Estándar'}\n` +
      `Cliente: ${booking.fullName || ''}\n` +
      `Tel: ${booking.phone || ''}\n` +
      `Email: ${booking.email || ''}\n` +
      `Locación: ${booking.location || ''}\n` +
      `Anticipo: $50 USD vía Zelle\n\n` +
      `Estudio Phoenix: 1825 E Northern Ave #273, Phoenix, AZ 85020\n` +
      `Teléfono: +1 (602) 582-3407`
    );
    const location = encodeURIComponent(booking.location || '1825 E Northern Ave #273, Phoenix, AZ 85020');
    const dates = `${formatGcalTime(startDate)}/${formatGcalTime(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&ctz=America/Phoenix`;
  }

  /* =========================================================================================
     LIVE CALENDAR CONTROLLER (Renderizado Dinámico, Slots y Manejo de Eventos)
     ========================================================================================= */
  let calCurrentDate = new Date();
  let calSelectedDateStr = '';
  let calSelectedTimeStr = '';

  const calendarMonthTitle = document.getElementById('calendarMonthTitle');
  const calendarDaysGrid = document.getElementById('calendarDaysGrid');
  const calPrevMonthBtn = document.getElementById('calPrevMonth');
  const calNextMonthBtn = document.getElementById('calNextMonth');
  const calTodayBtn = document.getElementById('calTodayBtn');
  const liveTimeSlotsWrapper = document.getElementById('liveTimeSlotsWrapper');
  const selectedDateHumanText = document.getElementById('selectedDateHumanText');
  const timeSlotsGrid = document.getElementById('timeSlotsGrid');
  const calSelectedSummary = document.getElementById('calSelectedSummary');
  const summaryDateTimeText = document.getElementById('summaryDateTimeText');
  const bookingDesiredDateInput = document.getElementById('bookingDesiredDate');
  const bookingDesiredTimeInput = document.getElementById('bookingDesiredTime');

  const monthNamesEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNamesEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function renderLiveCalendar() {
    if (!calendarDaysGrid || !calendarMonthTitle) return;

    const year = calCurrentDate.getFullYear();
    const month = calCurrentDate.getMonth();
    const en = isEnglish();

    // Actualiza título del mes
    calendarMonthTitle.textContent = `${en ? monthNamesEn[month] : monthNamesEs[month]} ${year}`;

    // Deshabilita mes anterior si es anterior al mes actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (calPrevMonthBtn) {
      const isPastMonth = (year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth()));
      calPrevMonthBtn.disabled = isPastMonth;
      calPrevMonthBtn.style.opacity = isPastMonth ? '0.35' : '1';
      calPrevMonthBtn.style.cursor = isPastMonth ? 'not-allowed' : 'pointer';
    }

    calendarDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Domingo
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Días del mes anterior (padding inicial)
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevMonthLastDay - x + 1;
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month disabled not-available';
      cell.innerHTML = `<span class="day-number">${dayNum}</span>`;
      calendarDaysGrid.appendChild(cell);
    }

    // Días del mes actual
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);
      const dateStr = toYmd(year, month, day);

      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.setAttribute('data-date', dateStr);

      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = (calSelectedDateStr === dateStr);
      const hasOpenWindows = calendarLoaded && openWindowsForDay(dateStr).length > 0;

      if (isToday) {
        cell.classList.add('today');
      }

      if (isSelected) {
        cell.classList.add('selected');
        cell.style.setProperty('background', '#1E1C1A', 'important');
        cell.style.setProperty('background-color', '#1E1C1A', 'important');
        cell.style.setProperty('color', '#FFFFFF', 'important');
        cell.style.setProperty('border', '1.5px solid #1E1C1A', 'important');
        cell.style.setProperty('border-color', '#1E1C1A', 'important');
      }

      if (!isPast && hasOpenWindows) {
        // DÍA ABIERTO (Marcado por Isa en Google Calendar con "Disponibilidad")
        cell.classList.add('available-day');
        cell.innerHTML = `
          <span class="day-number">${day}</span>
          <span class="available-dot"></span>
        `;

        cell.addEventListener('click', () => {
          selectCalendarDay(dateStr, cellDate);
        });
      } else {
        // DÍA NO DISPONIBLE (Cerrado por defecto)
        cell.classList.add('disabled', 'not-available');
        cell.innerHTML = `
          <span class="day-number">${day}</span>
        `;
      }

      calendarDaysGrid.appendChild(cell);
    }

    // Días del mes siguiente (padding final hasta completar semanas)
    const totalCellsSoFar = firstDayIndex + lastDayOfMonth;
    const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
    for (let y = 1; y <= remainingCells; y++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month disabled not-available';
      cell.innerHTML = `<span class="day-number">${y}</span>`;
      calendarDaysGrid.appendChild(cell);
    }
  }

  function selectCalendarDay(dateStr, dateObj) {
    calSelectedDateStr = dateStr;

    // Resaltar celda seleccionada
    const allCells = calendarDaysGrid.querySelectorAll('.cal-day-cell');
    allCells.forEach(c => {
      c.classList.remove('selected');
      c.style.removeProperty('background');
      c.style.removeProperty('background-color');
      c.style.removeProperty('color');
      c.style.removeProperty('border');
      c.style.removeProperty('border-color');
      const num = c.querySelector('.day-number');
      if (num) num.style.removeProperty('color');
      const dot = c.querySelector('.available-dot');
      if (dot) dot.style.removeProperty('background');
    });
    const targetCell = calendarDaysGrid.querySelector(`.cal-day-cell[data-date="${dateStr}"]`);
    if (targetCell) {
      targetCell.classList.add('selected');
      targetCell.style.setProperty('background', '#1E1C1A', 'important');
      targetCell.style.setProperty('background-color', '#1E1C1A', 'important');
      targetCell.style.setProperty('color', '#FFFFFF', 'important');
      targetCell.style.setProperty('border', '1.5px solid #1E1C1A', 'important');
      targetCell.style.setProperty('border-color', '#1E1C1A', 'important');
      const num = targetCell.querySelector('.day-number');
      if (num) num.style.setProperty('color', '#FFFFFF', 'important');
      const dot = targetCell.querySelector('.available-dot');
      if (dot) dot.style.setProperty('background', '#FFFFFF', 'important');
    }

    // Formatear texto legible del día seleccionado
    const en = isEnglish();
    const dayName = en ? dayNamesEn[dateObj.getDay()] : dayNamesEs[dateObj.getDay()];
    const monthName = en ? monthNamesEn[dateObj.getMonth()] : monthNamesEs[dateObj.getMonth()];
    const humanDate = en 
      ? `${dayName}, ${monthName} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
      : `${dayName}, ${dateObj.getDate()} de ${monthName} de ${dateObj.getFullYear()}`;

    if (selectedDateHumanText) selectedDateHumanText.textContent = humanDate;

    // Renderizar slots de tiempo para ese día
    renderTimeSlots(dateStr);

    if (liveTimeSlotsWrapper) {
      liveTimeSlotsWrapper.style.display = 'block';
    }
  }

  function renderTimeSlots(dateStr) {
    if (!timeSlotsGrid) return;
    timeSlotsGrid.innerHTML = '';
    const en = isEnglish();

    const rawWindows = (openWindowsForDay(dateStr) || []).slice().sort((a, b) => a.start - b.start);

    // De-duplicate windows
    const seen = new Set();
    const windows = [];
    rawWindows.forEach(w => {
      const key = `${w.periodKey || ''}-${w.start.getTime()}-${w.end.getTime()}`;
      if (!seen.has(key)) {
        seen.add(key);
        windows.push(w);
      }
    });

    if (windows.length === 0) {
      const emptyNote = document.createElement('div');
      emptyNote.style.gridColumn = '1 / -1';
      emptyNote.style.textAlign = 'center';
      emptyNote.style.color = 'var(--text-muted)';
      emptyNote.style.padding = '1rem';
      emptyNote.style.fontSize = '0.88rem';
      emptyNote.textContent = en 
        ? 'No open time slots remaining for this day. You can suggest a custom time below.' 
        : 'No hay horarios disponibles para este día. Puedes sugerir un horario personalizado abajo.';
      timeSlotsGrid.appendChild(emptyNote);
    } else {
      windows.forEach(w => {
        const periodTitle = en ? w.labelEn : w.labelEs;
        const timeRange = en ? w.timeEn : w.timeEs;
        const noteBadge = w.noteEs ? (en ? w.noteEn : w.noteEs) : (en ? 'Available' : 'Disponible');
        const formattedChoice = `${periodTitle} (${timeRange})`;

        const card = document.createElement('div');
        const isSelected = (calSelectedTimeStr === formattedChoice || calSelectedTimeStr === periodTitle);
        card.className = `time-slot-chip time-period-card ${isSelected ? 'selected' : ''}`;
        card.setAttribute('data-period', w.periodKey || '');
        card.setAttribute('data-value', formattedChoice);
        
        card.innerHTML = `
          <div class="period-top-row">
            <span class="period-icon"><i class="fa-solid ${w.icon || 'fa-clock'}"></i></span>
            <span class="period-badge">${noteBadge}</span>
          </div>
          <div class="period-main-title">${periodTitle}</div>
          <div class="period-time-range">${timeRange}</div>
        `;

        card.addEventListener('click', () => {
          selectTimeSlot(dateStr, formattedChoice, false);
          const customInp = document.getElementById('customTimeInput');
          if (customInp) customInp.value = formattedChoice;
        });

        timeSlotsGrid.appendChild(card);
      });
    }

    // Custom time input listener
    const customInp = document.getElementById('customTimeInput');
    const btnApply = document.getElementById('btnApplyCustomTime');
    if (customInp) {
      if (calSelectedTimeStr) customInp.value = calSelectedTimeStr;
      customInp.oninput = function() {
        if (customInp.value.trim()) {
          selectTimeSlot(dateStr, customInp.value.trim(), true);
        }
      };
      customInp.onkeydown = function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (customInp.value.trim()) {
            selectTimeSlot(dateStr, customInp.value.trim(), true);
          }
        }
      };
    }
    if (btnApply && customInp) {
      btnApply.onclick = function() {
        if (customInp.value.trim()) {
          selectTimeSlot(dateStr, customInp.value.trim(), true);
        }
      };
    }
  }

  function selectTimeSlot(dateStr, timeStr, isCustom) {
    calSelectedTimeStr = timeStr;

    // Actualiza estilo visual de los chips
    const cards = timeSlotsGrid.querySelectorAll('.time-slot-chip');
    cards.forEach(c => {
      const val = c.getAttribute('data-value');
      const title = c.querySelector('.period-main-title')?.textContent.trim();
      if (!isCustom && (val === timeStr || title === timeStr)) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    // Actualiza datos de la reserva
    bookingData.desiredDate = dateStr;
    bookingData.desiredTime = timeStr;

    if (bookingDesiredDateInput) bookingDesiredDateInput.value = dateStr;
    if (bookingDesiredTimeInput) bookingDesiredTimeInput.value = timeStr;

    // Muestra banner de confirmación
    if (calSelectedSummary && summaryDateTimeText) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const en = isEnglish();
      const monthName = en ? monthNamesEn[dt.getMonth()] : monthNamesEs[dt.getMonth()];
      const dayName = en ? dayNamesEn[dt.getDay()] : dayNamesEs[dt.getDay()];
      
      summaryDateTimeText.textContent = en
        ? `${dayName}, ${monthName} ${d}, ${y} — ${timeStr}`
        : `${dayName}, ${d} de ${monthName} de ${y} — ${timeStr}`;
      calSelectedSummary.style.display = 'flex';
    }

    updateSummary();
  }

  // Funciones accesibles globalmente para eventos en línea
  window.clearSelectedSlot = function() {
    calSelectedDateStr = '';
    calSelectedTimeStr = '';
    bookingData.desiredDate = '';
    bookingData.desiredTime = '';
    if (bookingDesiredDateInput) bookingDesiredDateInput.value = '';
    if (bookingDesiredTimeInput) bookingDesiredTimeInput.value = '';
    const customInp = document.getElementById('customTimeInput');
    if (customInp) customInp.value = '';
    if (calSelectedSummary) calSelectedSummary.style.display = 'none';
    if (liveTimeSlotsWrapper) liveTimeSlotsWrapper.style.display = 'none';
    if (calendarDaysGrid) {
      const allCells = calendarDaysGrid.querySelectorAll('.cal-day-cell');
      allCells.forEach(c => {
        c.classList.remove('selected');
      });
    }
  };

  window.toggleBackupDate = function() {
    const backupContent = document.getElementById('backupDateContent');
    if (backupContent) {
      const isHidden = backupContent.style.display === 'none' || !backupContent.style.display;
      backupContent.style.display = isHidden ? 'block' : 'none';
    }
  };

  // Botones de navegación del calendario
  if (calPrevMonthBtn) {
    calPrevMonthBtn.addEventListener('click', () => {
      const today = new Date();
      if (calCurrentDate.getFullYear() > today.getFullYear() || 
         (calCurrentDate.getFullYear() === today.getFullYear() && calCurrentDate.getMonth() > today.getMonth())) {
        calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
        renderLiveCalendar();
      }
    });
  }

  if (calNextMonthBtn) {
    calNextMonthBtn.addEventListener('click', () => {
      calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
      renderLiveCalendar();
    });
  }

  if (calTodayBtn) {
    calTodayBtn.addEventListener('click', () => {
      calCurrentDate = new Date();
      renderLiveCalendar();
    });
  }

  // 7. Step 2 Location Radio & Write-in Listeners
  const locationRadios = document.querySelectorAll('input[name="locationRadio"]');
  const locationDetailBox = document.getElementById('locationDetailBox');
  const locationDetailInput = document.getElementById('locationDetailInput');

  function syncLocation() {
    const checkedRadio = document.querySelector('input[name="locationRadio"]:checked');
    if (!checkedRadio) return;
    const val = checkedRadio.value;
    const isPrivate = val.toLowerCase().includes('domicilio') || val.toLowerCase().includes('privada') || val.toLowerCase().includes('private');

    if (locationDetailBox) {
      locationDetailBox.style.display = isPrivate ? 'block' : 'none';
    }

    if (isPrivate && locationDetailInput && locationDetailInput.value.trim()) {
      bookingData.locationCustom = locationDetailInput.value.trim();
      bookingData.location = `${val} (${locationDetailInput.value.trim()})`;
    } else {
      bookingData.locationCustom = '';
      bookingData.location = val;
    }
    updateSummary();
  }

  locationRadios.forEach(radio => radio.addEventListener('change', syncLocation));
  if (locationDetailInput) {
    locationDetailInput.addEventListener('input', syncLocation);
  }

  // 8. Step 4 Referral Select & Write-in Listeners
  const referralSelect = document.getElementById('clientReferral');
  const referralDetailBox = document.getElementById('referralDetailBox');
  const referralDetailInput = document.getElementById('referralDetailInput');

  function syncReferral() {
    if (!referralSelect) return;
    const en = isEnglish();
    const val = referralSelect.value;
    const isOther = val.toLowerCase().includes('otro') || val.toLowerCase().includes('other');

    if (referralDetailBox) {
      referralDetailBox.style.display = isOther ? 'block' : 'none';
    }

    if (isOther && referralDetailInput && referralDetailInput.value.trim()) {
      bookingData.referralCustom = referralDetailInput.value.trim();
      bookingData.referral = en ? `Other: ${referralDetailInput.value.trim()}` : `Otro: ${referralDetailInput.value.trim()}`;
    } else {
      bookingData.referralCustom = '';
      bookingData.referral = val;
    }
  }

  if (referralSelect) referralSelect.addEventListener('change', syncReferral);
  if (referralDetailInput) referralDetailInput.addEventListener('input', syncReferral);

  // 9. Add-ons change
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      bookingData.addons = Array.from(addonCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      updateSummary();
    });
  });

  // 10. Wizard Step Navigation
  function showStep(stepNumber) {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx + 1 === stepNumber);
    });

    progressItems.forEach((item, idx) => {
      if (idx + 1 < stepNumber) {
        item.classList.add('completed');
        item.classList.remove('active');
      } else if (idx + 1 === stepNumber) {
        item.classList.add('active');
        item.classList.remove('completed');
      } else {
        item.classList.remove('active', 'completed');
      }
    });

    if (btnPrev) btnPrev.style.display = stepNumber === 1 ? 'none' : 'inline-flex';
    if (btnNext) btnNext.style.display = stepNumber === totalSteps ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = stepNumber === totalSteps ? 'inline-flex' : 'none';

    window.scrollTo({
      top: wizard.offsetTop - 110,
      behavior: 'smooth'
    });
  }

  function validateCurrentStep() {
    const en = isEnglish();

    if (currentStep === 1) {
      if (!bookingData.sessionType) {
        alert(en ? 'Please select a session type to proceed.' : 'Por favor selecciona un tipo de sesión.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const dateInput = document.getElementById('bookingDesiredDate');
      if (!dateInput || !dateInput.value) {
        alert(en ? 'Please select a date and time slot from the live calendar.' : 'Por favor selecciona una fecha y horario disponible en el calendario en vivo.');
        return false;
      }
      bookingData.desiredDate = dateInput.value;
      const timeInput = document.getElementById('bookingDesiredTime');
      bookingData.desiredTime = timeInput ? timeInput.value : (bookingData.desiredTime || '10:00 AM');
      const backupInput = document.getElementById('bookingBackupDate');
      bookingData.backupDate = backupInput ? backupInput.value : '';

      syncLocation();

      const peopleInput = document.getElementById('bookingPeople');
      if (peopleInput) {
        bookingData.peopleCount = peopleInput.value;
      }
      return true;
    }

    if (currentStep === 3) {
      // Add-ons are optional, always valid
      return true;
    }

    if (currentStep === 4) {
      const nameInput = document.getElementById('clientName');
      const emailInput = document.getElementById('clientEmail');
      const phoneInput = document.getElementById('clientPhone');
      const termsChk = document.getElementById('agreeTerms');

      if (!nameInput || !nameInput.value.trim()) {
        alert(en ? 'Please enter your full name.' : 'Por favor introduce tu nombre completo.');
        nameInput.focus();
        return false;
      }
      if (!emailInput || !emailInput.value.trim()) {
        alert(en ? 'Please enter your email address.' : 'Por favor introduce tu correo electrónico.');
        emailInput.focus();
        return false;
      }
      if (!phoneInput || !phoneInput.value.trim()) {
        alert(en ? 'Please enter your phone number or WhatsApp.' : 'Por favor introduce tu teléfono o WhatsApp.');
        phoneInput.focus();
        return false;
      }
      if (termsChk && !termsChk.checked) {
        alert(en 
          ? 'Please accept the Official Terms & Cancellation Policy ($50 non-refundable retainer).' 
          : 'Por favor acepta las políticas oficiales y términos del servicio (anticipo de $50 USD).');
        return false;
      }

      bookingData.fullName = nameInput.value.trim();
      bookingData.email = emailInput.value.trim();
      bookingData.phone = phoneInput.value.trim();

      syncReferral();

      const notesInput = document.getElementById('clientNotes');
      if (notesInput) bookingData.visionNotes = notesInput.value;

      return true;
    }

    return true;
  }

  function updateSummary() {
    const summarySession = document.getElementById('summarySessionType');
    const summaryRetainer = document.getElementById('summaryRetainer');
    const summaryAddons = document.getElementById('summaryAddons');
    const en = isEnglish();

    if (summarySession) {
      if (bookingData.sessionKey === 'custom') {
        summarySession.innerHTML = `<strong>${bookingData.sessionType}</strong><br><small style="color:var(--text-light); font-size:0.83rem;">${bookingData.customDetails.category} · ${bookingData.customDetails.duration}</small>`;
      } else if (bookingData.selectedPackage) {
        let detailsSub = bookingData.selectedPackage;
        if (bookingData.primaryAnswer) {
          detailsSub += `<br><span style="color: var(--accent-terracotta); font-weight: 500;">${bookingData.primaryAnswer}</span>`;
        }
        if (bookingData.followUpAnswer) {
          detailsSub += ` · <span style="color: var(--text-muted);">${bookingData.followUpAnswer}</span>`;
        }
        summarySession.innerHTML = `<strong>${bookingData.sessionType}</strong><br><small style="font-size:0.83rem; line-height: 1.4; display: inline-block; margin-top: 0.2rem;">${detailsSub}</small>`;
      } else {
        summarySession.textContent = bookingData.sessionType;
      }
    }
    if (summaryRetainer) summaryRetainer.textContent = bookingData.retainerAmount;
    if (summaryAddons) {
      summaryAddons.textContent = bookingData.addons.length > 0 
        ? bookingData.addons.join(', ') 
        : (en ? 'None / To be decided' : 'Ninguno / Por definir');
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateCurrentStep()) {
        currentStep++;
        updateSummary();
        showStep(currentStep);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateCurrentStep()) {
        const en = isEnglish();

        // Show success modal with enriched bilingual personalized answers
        if (modal) {
          const modalText = document.getElementById('modalSummaryText');
          if (modalText) {
            let detailsHtml = '';
            if (bookingData.sessionKey === 'custom') {
              detailsHtml = `
                <strong>${en ? 'Custom Category' : 'Categoría personalizada'}:</strong> ${bookingData.customDetails.category}<br>
                <strong>${en ? 'Estimated Duration' : 'Duración estimada'}:</strong> ${bookingData.customDetails.duration}<br>
                <strong>${en ? 'Participants' : 'Asistentes'}:</strong> ${bookingData.customDetails.people}<br>
                <strong>${en ? 'Services requested' : 'Servicios combinados'}:</strong> ${bookingData.customDetails.services.join(', ') || (en ? 'Custom photo' : 'Fotografía a medida')}<br>
                <strong>${en ? 'Budget range' : 'Presupuesto estimado'}:</strong> ${bookingData.customDetails.budget}<br>
              `;
            } else {
              detailsHtml = `
                <strong>${en ? 'Selected Package' : 'Paquete seleccionado'}:</strong> ${bookingData.selectedPackage || (en ? 'Standard' : 'Estándar')}<br>
                ${bookingData.primaryAnswer ? `<strong>${bookingData.primaryQuestionLabel || (en ? 'Occasion / Milestone' : 'Ocasión / Hito')}:</strong> ${bookingData.primaryAnswer}<br>` : ''}
                ${bookingData.followUpAnswer ? `<strong>${bookingData.followUpQuestionLabel || (en ? 'Specific Preference' : 'Preferencia específica')}:</strong> ${bookingData.followUpAnswer}<br>` : ''}
              `;
            }

            modalText.innerHTML = `
              <strong>${en ? 'Session' : 'Sesión'}:</strong> ${bookingData.sessionType}<br>
              ${detailsHtml}
              <strong>${en ? 'Preferred Date & Time' : 'Fecha y Horario preferido'}:</strong> ${bookingData.desiredDate} ${bookingData.desiredTime ? `· ${bookingData.desiredTime} (MST)` : ''} ${bookingData.backupDate ? `(${en ? 'Backup' : 'Respaldo'}: ${bookingData.backupDate})` : ''}<br>
              <strong>${en ? 'Location' : 'Locación'}:</strong> ${bookingData.location}<br>
              <strong>${en ? 'Client' : 'Cliente'}:</strong> ${bookingData.fullName} (${bookingData.phone})<br>
              <strong>${en ? 'Email' : 'Correo'}:</strong> ${bookingData.email}<br>
              ${bookingData.referral ? `<strong>${en ? 'Referral' : 'Recomendación'}:</strong> ${bookingData.referral}<br>` : ''}
              <strong>${en ? 'Booking Retainer' : 'Depósito de reserva'}:</strong> $50 USD ${en ? 'via Zelle or Cash to confirm date.' : 'vía Zelle o Efectivo para asegurar tu fecha.'}
            `;
          }

          // Setup 1-click Google Calendar Add button
          const gcalModalBtn = document.getElementById('btnBookingGcal');
          if (gcalModalBtn) {
            gcalModalBtn.href = buildGoogleCalendarAddUrl(bookingData);
          }

          modal.classList.add('active');
        }

        // Build enriched plain text message for WhatsApp and Email
        let messageText = '';
        let emailSubject = '';

        if (en) {
          emailSubject = `Reservation Request - ${bookingData.sessionType} - ${bookingData.fullName}`;
          let specificSection = '';
          if (bookingData.sessionKey === 'custom') {
            specificSection = 
              `• Custom Category: ${bookingData.customDetails.category}\n` +
              `• Estimated Duration: ${bookingData.customDetails.duration}\n` +
              `• Participants: ${bookingData.customDetails.people}\n` +
              `• Requested Services: ${bookingData.customDetails.services.join(', ') || 'Custom photo'}\n` +
              `• Estimated Budget: ${bookingData.customDetails.budget}\n` +
              `• Vision & Concepts: ${bookingData.customDetails.visionText || 'Bespoke project'}\n`;
          } else {
            specificSection = 
              `• Package / Variation: ${bookingData.selectedPackage || 'Standard'}\n` +
              (bookingData.primaryAnswer ? `• ${bookingData.primaryQuestionLabel || 'Occasion / Milestone'}: ${bookingData.primaryAnswer}\n` : '') +
              (bookingData.followUpAnswer ? `• ${bookingData.followUpQuestionLabel || 'Style / Preference'}: ${bookingData.followUpAnswer}\n` : '');
          }

          messageText = 
            `Hello Isa! I would like to reserve a session with Isa Hernandez Photo & Makeup LLC:\n\n` +
            `• Session Type: ${bookingData.sessionType}\n` +
            specificSection +
            `• Preferred Date & Time: ${bookingData.desiredDate} at ${bookingData.desiredTime || '10:00 AM'} (MST)\n` +
            `• Backup Date: ${bookingData.backupDate || 'N/A'}\n` +
            `• Location: ${bookingData.location}\n` +
            `• People Count: ${bookingData.peopleCount}\n` +
            `• Add-ons / Extras: ${bookingData.addons.join(', ') || 'None'}\n` +
            `• Full Name: ${bookingData.fullName}\n` +
            `• Email: ${bookingData.email}\n` +
            `• Phone: ${bookingData.phone}\n` +
            (bookingData.referral ? `• How I found you: ${bookingData.referral}\n` : '') +
            `• Retainer Deposit: Ready to send $50 USD via Zelle to lock date\n\n` +
            `Additional Notes: ${bookingData.visionNotes || 'Looking forward to our photoshoot!'}`;
        } else {
          emailSubject = `Solicitud de Reserva - ${bookingData.sessionType} - ${bookingData.fullName}`;
          let specificSection = '';
          if (bookingData.sessionKey === 'custom') {
            specificSection = 
              `• Categoría personalizada: ${bookingData.customDetails.category}\n` +
              `• Duración estimada: ${bookingData.customDetails.duration}\n` +
              `• Asistentes / Personas: ${bookingData.customDetails.people}\n` +
              `• Servicios combinados: ${bookingData.customDetails.services.join(', ') || 'Fotografía a medida'}\n` +
              `• Rango de presupuesto: ${bookingData.customDetails.budget}\n` +
              `• Visión del proyecto: ${bookingData.customDetails.visionText || 'Proyecto especial'}\n`;
          } else {
            specificSection = 
              `• Paquete / Variante: ${bookingData.selectedPackage || 'Estándar'}\n` +
              (bookingData.primaryAnswer ? `• ${bookingData.primaryQuestionLabel || 'Ocasión / Hito'}: ${bookingData.primaryAnswer}\n` : '') +
              (bookingData.followUpAnswer ? `• ${bookingData.followUpQuestionLabel || 'Preferencia de Estilo'}: ${bookingData.followUpAnswer}\n` : '');
          }

          messageText = 
            `¡Hola Isa! Quiero reservar una sesión con Isa Hernandez Photo & Makeup LLC:\n\n` +
            `• Tipo de sesión: ${bookingData.sessionType}\n` +
            specificSection +
            `• Fecha y Horario: ${bookingData.desiredDate} a las ${bookingData.desiredTime || '10:00 AM'} (MST)\n` +
            `• Fecha de respaldo: ${bookingData.backupDate || 'N/A'}\n` +
            `• Locación: ${bookingData.location}\n` +
            `• Personas: ${bookingData.peopleCount}\n` +
            `• Extras / Maquillaje: ${bookingData.addons.join(', ') || 'Sin extras'}\n` +
            `• Nombre: ${bookingData.fullName}\n` +
            `• Correo: ${bookingData.email}\n` +
            `• Teléfono: ${bookingData.phone}\n` +
            (bookingData.referral ? `• Cómo me encontraste: ${bookingData.referral}\n` : '') +
            `• Depósito $50 USD retainer: Listo para transferir vía Zelle para apartar fecha\n\n` +
            `Notas adicionales: ${bookingData.visionNotes || 'Quedo atenta para coordinar detalles.'}`;
        }

        // Setup WhatsApp link
        if (whatsappSendBtn) {
          whatsappSendBtn.href = `https://wa.me/16025823407?text=${encodeURIComponent(messageText)}`;
        }

        // Setup Email link
        if (emailSendBtn) {
          emailSendBtn.href = `mailto:Isavision21@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(messageText)}`;
        }
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Handle URL query parameters to preselect service and package from services.html
  function handleUrlParams() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = (urlParams.get('service') || '').toLowerCase().trim();
      const pkgParam = (urlParams.get('package') || '').toLowerCase().trim();

      const serviceKeyMap = {
        'couples': 'couples',
        'couple': 'couples',
        'pareja': 'couples',
        'parejas': 'couples',
        'families': 'families',
        'family': 'families',
        'familia': 'families',
        'familias': 'families',
        'birthdays': 'birthdays',
        'birthday': 'birthdays',
        'cumpleanos': 'birthdays',
        'cumpleaños': 'birthdays',
        'graduations': 'graduations',
        'graduation': 'graduations',
        'seniors': 'graduations',
        'weddings': 'weddings',
        'wedding': 'weddings',
        'boda': 'weddings',
        'bodas': 'weddings',
        'quinceaneras': 'quinceaneras',
        'quinceanera': 'quinceaneras',
        'quince': 'quinceaneras',
        'branding': 'branding',
        'professionals': 'branding',
        'profesionales': 'branding',
        'marca-personal': 'branding',
        'makeup': 'makeup',
        'maquillaje': 'makeup',
        'custom': 'custom',
        'otro': 'custom'
      };

      const keys = ['couples', 'families', 'birthdays', 'graduations', 'weddings', 'quinceaneras', 'branding', 'makeup', 'custom'];
      const matchedKey = serviceKeyMap[serviceParam] || 'couples';
      const targetIndex = keys.indexOf(matchedKey);

      if (targetIndex !== -1 && sessionCards[targetIndex]) {
        sessionCards.forEach(c => c.classList.remove('selected'));
        sessionCards[targetIndex].classList.add('selected');
        const titleEl = sessionCards[targetIndex].querySelector('.choice-title');
        bookingData.sessionType = titleEl ? titleEl.textContent.trim() : (sessionCards[targetIndex].getAttribute('data-service') || 'Personalizada');
      }

      renderDynamicSession(matchedKey);

      if (pkgParam) {
        const optionCards = dynamicContainer.querySelectorAll('.dynamic-option-card');
        const cleanPkg = pkgParam.replace(/[-_]/g, ' ');
        let matchedCard = null;
        optionCards.forEach(card => {
          const title = (card.getAttribute('data-pkg-title') || '').toLowerCase();
          if (title.includes(cleanPkg) || title.includes(pkgParam)) {
            matchedCard = card;
          }
        });

        if (matchedCard) {
          optionCards.forEach(c => {
            c.classList.remove('active');
            const icon = c.querySelector('.dynamic-option-title i');
            if (icon) icon.style.color = '#CCC';
          });
          matchedCard.classList.add('active');
          const icon = matchedCard.querySelector('.dynamic-option-title i');
          if (icon) icon.style.color = 'var(--text-dark)';
          bookingData.selectedPackage = matchedCard.getAttribute('data-pkg-title');
          updateSummary();
        }
      }
    } catch (e) {
      console.warn('URL param parse error:', e);
      renderDynamicSession('couples');
    }
  }

  // Listen for languageChanged event from i18n.js
  window.addEventListener('languageChanged', () => {
    const selectedCard = document.querySelector('.session-choice-card.selected');
    if (selectedCard) {
      const titleEl = selectedCard.querySelector('.choice-title');
      if (titleEl) bookingData.sessionType = titleEl.textContent.trim();
    }
    if (bookingData.sessionKey) {
      renderDynamicSession(bookingData.sessionKey);
    }
    renderLiveCalendar();
    updateSummary();
  });

  // Helper for automated test scenarios
  function handleTestScenario() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const test = urlParams.get('testScenario');
      if (!test) return;

      if (test === 'live_calendar') {
        currentStep = 2;
        showStep(2);
        calCurrentDate = new Date(2026, 8, 1); // Septiembre 2026 (mes de la captura de Isa)
        loadAvailability().then(() => {
          setTimeout(() => {
            const cells = document.querySelectorAll('.cal-day-cell.available-day');
            if (cells.length > 0) {
              cells[0].click(); // Click primer día disponible (Lunes 28 de Septiembre)
              setTimeout(() => {
                const slots = document.querySelectorAll('.time-slot-chip');
                if (slots.length >= 1) {
                  slots[0].click(); // Select first slot
                }
              }, 200);
            }
          }, 300);
        });
      } else if (test === 'live_calendar_sept30') {
        currentStep = 2;
        showStep(2);
        calCurrentDate = new Date(2026, 8, 1);
        loadAvailability().then(() => {
          setTimeout(() => {
            const cells = document.querySelectorAll('.cal-day-cell.available-day');
            if (cells.length > 1) {
              cells[1].click(); // Click Miércoles 30 de Septiembre
            }
          }, 300);
        });
      } else if (test === 'live_calendar_sept30_tarde') {
        currentStep = 2;
        showStep(2);
        calCurrentDate = new Date(2026, 8, 1);
        loadAvailability().then(() => {
          setTimeout(() => {
            const cells = document.querySelectorAll('.cal-day-cell.available-day');
            if (cells.length > 1) {
              cells[1].click(); // Click Miércoles 30 de Septiembre
              setTimeout(() => {
                const slots = document.querySelectorAll('.time-slot-chip');
                if (slots.length > 1) slots[1].click(); // Click Tarde
              }, 200);
            }
          }, 300);
        });
      } else if (test === 'live_calendar_october') {
        currentStep = 2;
        showStep(2);
        calCurrentDate = new Date(2026, 9, 1); // Octubre 2026
        loadAvailability();
      } else if (test === 'live_calendar_en') {
        currentStep = 2;
        showStep(2);
        calCurrentDate = new Date(2026, 8, 1);
        if (typeof setLanguage === 'function') setLanguage('en');
        loadAvailability().then(() => {
          setTimeout(() => {
            const cells = document.querySelectorAll('.cal-day-cell.available-day');
            if (cells.length > 0) {
              cells[0].click();
              setTimeout(() => {
                const slots = document.querySelectorAll('.time-slot-chip');
                if (slots.length > 0) slots[0].click();
              }, 200);
            }
          }, 300);
        });
      } else if (test === 'other_writein') {
        const primarySelect = document.getElementById('primaryQuestionSelect');
        if (primarySelect) {
          primarySelect.value = 'other';
          primarySelect.dispatchEvent(new Event('change'));
          const otherInput = document.getElementById('primaryOtherInput');
          if (otherInput) {
            otherInput.value = 'Propuesta de compromiso sorpresa en Lake Pleasant en barco privado';
            otherInput.dispatchEvent(new Event('input'));
          }
        }
      } else if (test === 'cascading_pets') {
        if (sessionCards[1]) sessionCards[1].click();
        const primarySelect = document.getElementById('primaryQuestionSelect');
        if (primarySelect) {
          primarySelect.value = 'pets';
          primarySelect.dispatchEvent(new Event('change'));
          const followSelect = document.getElementById('followUpQuestionSelect');
          if (followSelect) {
            for (let i = 0; i < followSelect.options.length; i++) {
              if (followSelect.options[i].text.includes('Otra opción') || followSelect.options[i].text.includes('Other option')) {
                followSelect.selectedIndex = i;
                break;
              }
            }
            followSelect.dispatchEvent(new Event('change'));
            const followOtherInput = document.getElementById('followUpOtherInput');
            if (followOtherInput) {
              followOtherInput.value = 'Dos perritos rescatados husky y golden retriever';
              followOtherInput.dispatchEvent(new Event('input'));
            }
          }
        }
      } else if (test === 'modal_confirmed') {
        const primarySelect = document.getElementById('primaryQuestionSelect');
        if (primarySelect) {
          primarySelect.value = 'engagement';
          primarySelect.dispatchEvent(new Event('change'));
        }
        showStep(2);
        const dateInput = document.getElementById('bookingDesiredDate');
        if (dateInput) dateInput.value = '2026-11-15';
        if (locationRadios[3]) {
          locationRadios[3].checked = true;
          locationRadios[3].dispatchEvent(new Event('change'));
        }
        if (locationDetailInput) {
          locationDetailInput.value = 'Rancho privado en Cave Creek, AZ';
          locationDetailInput.dispatchEvent(new Event('input'));
        }
        showStep(3);
        showStep(4);
        const nameInp = document.getElementById('clientName');
        const emailInp = document.getElementById('clientEmail');
        const phoneInp = document.getElementById('clientPhone');
        if (nameInp) nameInp.value = 'Sofia Ramos & Carlos Ortiz';
        if (emailInp) emailInp.value = 'sofia.carlos@ejemplo.com';
        if (phoneInp) phoneInp.value = '+1 (602) 555-8833';
        if (referralSelect) {
          referralSelect.value = 'Otro';
          referralSelect.dispatchEvent(new Event('change'));
        }
        if (referralDetailInput) {
          referralDetailInput.value = 'Recomendación de wedding planner';
          referralDetailInput.dispatchEvent(new Event('input'));
        }
        if (btnSubmit) btnSubmit.click();
      }
    } catch (e) {
      console.warn('Test scenario error:', e);
    }
  }

  // Initial step setup & handle query parameters
  handleUrlParams();
  if (new URLSearchParams(window.location.search).get('testScenario')) {
    handleTestScenario();
  } else {
    loadAvailability();
    showStep(1);
  }
  updateSummary();
});

