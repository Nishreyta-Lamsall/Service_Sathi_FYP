import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  English: {
    translation: {
      // Navbar Section
      navbarHome: "Home",
      about: "About Us",
      services: "All Services",
      contact: "Contact Us",
      login: "Login",
      logout: "Logout",
      myProfile: "My Profile",
      myBookings: "My Bookings",
      orderHistory: "Order History",
      language: "Language",

      // About Us Section
      hero: {
        title: "About Us",
      },
      imageTextSection: {
        welcome: "Welcome to Service Sathi",
        headline: "HOUSEHOLD SERVICES, EXPERTLY DELIVERED",
        description:
          "At Service Sathi, we make home management effortless with seamless, dependable household services. Our skilled professionals handle everything from cleaning to repairs with precision and care, so you can focus on what matters most.",
      },
      whatMakesUsDifferent: {
        title: "What Makes Us Different?",
        description:
          "Discover what sets us apart from the rest — our commitment to excellence, customer-first approach, and a team you can trust.",
      },
      features: {
        expertTeam: {
          title: "Expert Team",
          description:
            "Handpicked, trained professionals delivering precise, high-quality work.",
        },
        customerCentric: {
          title: "Customer-Centric",
          description:
            "Services tailored to your unique needs, prioritizing your satisfaction.",
        },
        reliable: {
          title: "Reliable & Trusted",
          description:
            "Your home is in safe, skilled hands with Service Sathi.",
        },
      },
      stats: {
        title: "Our Stats",
        servicesProvided: "Services Provided",
        serviceProviders: "Service Providers",
        activeUsers: "Active Users",
        happyCustomers: "Happy Customers",
      },
      faq: {
        title: "FAQ",
        questions: [
          {
            question: "What types of services does Service Sathi offer?",
            answer:
              "We offer a wide range of household services including plumbing, electrical services, maintenance, and more to cater to all your needs.",
          },
          {
            question: "How do I book a service with Service Sathi?",
            answer:
              "To book a service with Service Sathi, browse through the available services, select the service you need, and schedule an appointment based on your preferred time.",
          },
          {
            question: "Are your professionals qualified and reliable?",
            answer:
              "Yes, all our professionals are handpicked, trained, and thoroughly vetted to ensure high-quality and reliable service.",
          },
          {
            question: "What areas do you currently serve?",
            answer:
              "We currently serve only the Kathmandu Metropolitan City; however, we plan to expand our services to other areas in the future.",
          },
        ],
      },
      joinUs: {
        title: "Join Our Family",
        description:
          "Discover why thousands of customers trust Service Sathi for their household needs. Let’s make your life easier, one service at a time.",
        button: "Get Started Today →",
      },
      // HomePage Section
      home: {
        hero: {
          title: "YOUR TRUSTED PARTNER FOR EVERY HOME NEED",
          description:
            "Transform your home into a haven with Service Sathi — your trusted partner for reliable, top-notch household services. From meticulous cleaning to expert repairs, we deliver convenience, quality, and peace of mind tailored to your unique needs.",
          button: "DISCOVER MORE",
        },
        services: {
          title: "Services Offered",
          description: "Find a variety of services under this category.",
        },
        latestPicks: {
          title: "Latest Picks",
        },
        subscriptionPlans: {
          title: "Subscription Plans",
          description:
            "Get the most out of your membership with exclusive perks and discounts.",
          servicesIncluded: "Services included:",
          choosePlan: "Choose Plan",
        },
        testimonials: {
          title: "Testimonials",
        },
      },
    },
  },
  Nepali: {
    translation: {
      // Navbar Section
      navbarHome: "गृहपृष्ठ",
      about: "हाम्रो बारेमा",
      services: "सबै सेवाहरू",
      contact: "सम्पर्क गर्नुहोस्",
      login: "लग - इन",
      logout: "बाहिर निस्कनुहोस्",
      myProfile: "मेरो प्रोफाइल",
      myBookings: "मेरो बुकिंगहरू",
      orderHistory: "अर्डर इतिहास",
      language: "भाषा",

      // About Us Section
      hero: {
        title: "हाम्रो बारेमा",
      },
      imageTextSection: {
        welcome: "सर्भिस साथीमा स्वागत छ",
        headline: "गृह सेवा, विशेषज्ञता पूर्वक प्रदान गरिन्छ",
        description:
          "सर्भिस साथीमा, हामी तपाईंको घर व्यवस्थापनलाई सहज बनाउँछौं। हाम्रो दक्ष पेशेवरहरूले सफाइदेखि मर्मतसम्मका सबै कुराहरू अत्यन्तै ध्यानपूर्वक र कुशलताका साथ सम्हाल्छन्, ताकि तपाईं महत्वपूर्ण कुरामा ध्यान केन्द्रित गर्न सक्नुहुन्छ।",
      },
      whatMakesUsDifferent: {
        title: "हामी किन फरक छौं?",
        description:
          "हाम्रो उत्कृष्टता प्रतिको प्रतिबद्धता, ग्राहक-प्रथम दृष्टिकोण, र तपाईं भरोसा गर्न सक्ने टोलीले हामीलाई अरूभन्दा फरक बनाउँछ।",
      },
      features: {
        expertTeam: {
          title: "विशेषज्ञ टोली",
          description:
            "हाम्रो पेशेवरहरू ध्यानपूर्वक चयन गरिएका छन्, प्रशिक्षित छन्, र उच्च-गुणस्तरीय सेवा प्रदान गर्छन्।",
        },
        customerCentric: {
          title: "ग्राहक-केंद्रित",
          description:
            "तपाईंको आवश्यकतालाई प्राथमिकता दिँदै अनुकूल सेवा प्रदान गरिन्छ।",
        },
        reliable: {
          title: "विश्वसनीय र भरोसायोग्य",
          description: "सर्भिस साथीमा तपाईंको घर दक्ष हातहरूमा सुरक्षित छ।",
        },
      },
      stats: {
        title: "हाम्रो तथ्यांक",
        servicesProvided: "प्रदान गरिएका सेवाहरू",
        serviceProviders: "सेवा प्रदायकहरू",
        activeUsers: "सक्रिय प्रयोगकर्ताहरू",
        happyCustomers: "सन्तुष्ट ग्राहकहरू",
      },
      faq: {
        title: "सोधिने प्रश्नहरू",
        questions: [
          {
            question: "सर्भिस साथीले के-के सेवा प्रदान गर्छ?",
            answer:
              "हामीले प्लम्बिङ, बिजुली सेवा, मर्मत, सफाइ, र अन्य विभिन्न गृह सेवाहरू प्रदान गर्छौं।",
          },
          {
            question: "सर्भिस साथीमार्फत सेवा कसरी बुक गर्ने?",
            answer:
              "हाम्रो वेब साइटमा गएर उपलब्ध सेवाहरू ब्राउज गर्नुहोस्, आवश्यक सेवा चयन गर्नुहोस्, र तपाईंलाई उपयुक्त समय अनुसार अपोइन्टमेन्ट तय गर्नुहोस्।",
          },
          {
            question: "तपाईंका पेशेवरहरू योग्य र विश्वसनीय छन्?",
            answer:
              "हो, हाम्रा सबै पेशेवरहरू राम्रोसँग प्रशिक्षित, योग्य, र विश्वसनीय छन्।",
          },
          {
            question:
              "हाल तपाईंहरूले कुन क्षेत्रहरूमा सेवा प्रदान गर्दै हुनुहुन्छ?",
            answer:
              "हामी हाल काठमाडौँ महानगरपालिका क्षेत्रमा मात्र सेवा प्रदान गरिरहेका छौं; तर भविष्यमा अन्य क्षेत्रहरूमा पनि विस्तार गर्ने योजना छ।",
          },
        ],
      },
      joinUs: {
        title: "हाम्रो परिवारमा सामेल हुनुहोस्",
        description:
          "हजारौं ग्राहकहरूले आफ्नो गृह सेवाका आवश्यकताहरूका लागि किन सर्भिस साथीलाई विश्वास गर्छन् भनेर पत्ता लगाउनुहोस्। तपाईंको जीवनलाई अझ सहज बनाऔं।",
        button: "आजै सुरु गर्नुहोस् →",
      },
      // HomePage Section
      home: {
        hero: {
          title: "तपाईंको घरको हरेक आवश्यकताको लागि विश्वसनीय साथी",
          description:
            "सर्भिस साथीको साथ तपाईंको घरलाई स्वर्ग बनाउनुहोस् — विश्वसनीय, उत्कृष्ट गृह सेवाहरूको लागि तपाईंको विश्वसनीय साथी। सफाइदेखि मर्मतसम्म, हामी तपाईंको आवश्यकताको आधारमा सुविधा, गुणस्तर, र मनको शान्ति प्रदान गर्छौं।",
          button: "थप जान्नुहोस्",
        },
        services: {
          title: "प्रदान गरिएका सेवाहरू",
          description: "यस श्रेणी अन्तर्गत विभिन्न सेवाहरू पाउनुहोस्।",
        },
        latestPicks: {
          title: "नयाँ छनौटहरू",
        },
        subscriptionPlans: {
          title: "सदस्यता योजनाहरू",
          description:
            "विशेष सुविधाहरू र छुटहरूको साथ आफ्नो सदस्यताको अधिकतम लाभ उठाउनुहोस्।",
          servicesIncluded: "सेवाहरू समावेश छन्:",
          choosePlan: "योजना छनौट गर्नुहोस्",
        },
        testimonials: {
          title: "ग्राहकहरूको प्रतिक्रिया",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "English", // Default language
  fallbackLng: "English",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
