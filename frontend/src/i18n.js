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
      myProfilee: "My Profile",
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
          title2: "Plan",
          description:
            "Get the most out of your membership with exclusive perks and discounts.",
          servicesIncluded: "Services included:",
          choosePlan: "Choose Plan",
          noSubscriptions: "No subscriptions available",
          freeInspections: "Free scheduled inspections every 4 months",
          discountedServices:
            "Carpet and Upholstery Cleaning, Window Cleaning, Light Installation, Power Outlet Installation, Ceiling Fan Installation, Electrical Safety Inspections, InverterInstallation.",
          discountOffer: "discount on selected services",
          subscriptionDuration: "subscription",
        },
        testimonials: {
          title: "Testimonials",
        },
      },
      //Services Section
      service: {
        discover: "Discover the right service for you.",
        searchPlaceholder: "Search services...",
        searchButton: "Search",
        filters: "Filters",
        services: {
          houseCleaning: "House Cleaning Services",
          electrical: "Electrical Services",
          carpentry: "Carpentry Services",
          gardening: "Gardening Services",
          plumbing: "Plumbing Services",
        },
        availability: {
          available: "Available",
          notAvailable: "Not Available",
        },
      },
      //Contact Us Section
      contactUs: {
        contactHelpTeam: "Contact the Help Team",
        address: "Balaju, Kathmandu",
        phone: "+977 9851097545",
        email: "servicesathi.business@gmail.com",
        contactus: "Contact Us",
        form: {
          firstName: "First Name*",
          lastName: "Last Name*",
          email: "Email*",
          phone: "Phone number*",
          message: "Your message...",
          submitButton: "Submit",
        },
        successMessage: "Message sent successfully!",
        errorMessage: {
          failed: "Failed to send message. Try again!",
          error: "Error occurred. Please try again!",
        },
      },
      authForm: {
        welcome: "Welcome",
        toServiceSathi: "to Service Sathi",
        signUp: "Sign Up",
        login: "Login",
        fullName: "Full Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        forgotPassword: "Forgot your password?",
        resendVerificationEmail: "Resend Email",
        didntReceiveVerification: "Didn't receive a verification email?",
        alreadyHaveAccount: "Already have an account?",
        dontHaveAccount: "Don't have an account?",
        userRegistered:
          "User registered. Check your email for verification link.",
        verificationEmailSent: "Verification email has been sent.",
        failedToResendEmail: "Failed to resend email. Try again!",
        errorOccurred: "Error occurred. Please try again!",
      },
      myProfile: {
        contactInformation: "CONTACT INFORMATION",
        emailId: "Email ID:",
        phone: "Phone:",
        address: "Address:",
        otherInformation: "OTHER INFORMATION",
        gender: "Gender:",
        male: "Male",
        female: "Female",
        birthday: "Birthday:",
        saveInformation: "Save Information",
        edit: "Edit",
      },
      myBookingss: {
        title: "My Bookings",
        orderStatus: "Order Status:",
        serviceProvider: "Service Provider:",
        amount: "Amount:",
        dateTime: "Date and Time:",
        cancelBooking: "Cancel Booking",
        noBookings: "No bookings available.",
        completedBookings: "Completed Bookings",
        completed: "Completed",
        review: "Leave Review",
        reviewTitle: "Leave a Review",
        rating: "Rating:",
        comment: "Comment:",
        submit: "Submit Review",
        close: "Close",
        cancelled: "Cancelled",
        noOrder: "No orders found in history.",
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
      myProfilee: "मेरो प्रोफाइल",
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
          title2: "योजना",
          description:
            "विशेष सुविधाहरू र छुटहरूको साथ आफ्नो सदस्यताको अधिकतम लाभ उठाउनुहोस्।",
          servicesIncluded: "सेवाहरू समावेश छन्:",
          choosePlan: "योजना छनौट गर्नुहोस्",
          noSubscriptions: "कुनै सदस्यता उपलब्ध छैन",
          freeInspections: "हरेक ४ महिनामा निःशुल्क तालिकाबद्ध निरीक्षणहरू",
          discountedServices:
            "कार्पेट र अपहोल्स्ट्री सफाइ, सिसा सफाइ, बत्ती जडान, पावर आउटलेट जडान, छतको पंखा जडान, विद्युतीय सुरक्षा निरीक्षण, इनभर्टर जडान।",
          discountOffer: "चयन गरिएका सेवाहरूमा छुट",
          subscriptionDuration: "सदस्यता",
        },
        testimonials: {
          title: "ग्राहकहरूको प्रतिक्रिया",
        },
      },
      // Services section
      service: {
        discover: "तपाईंको लागि सही सेवा खोज्नुहोस्।",
        searchPlaceholder: "सेवा खोज्नुहोस्...",
        searchButton: "खोज्नुहोस्",
        filters: "फिल्टरहरू",
        services: {
          houseCleaning: "घर सफाई सेवा",
          electrical: "विद्युत सेवा",
          carpentry: "काठकाम सेवा",
          gardening: "बगैँचा सेवा",
          plumbing: "प्लम्बिङ सेवा",
        },
        availability: {
          available: "उपलब्ध छ",
          notAvailable: "उपलब्ध छैन",
        },
      },
      //Contact Us Section
      contactUs: {
        contactHelpTeam: "मद्दत टोलीसँग सम्पर्क गर्नुहोस्",
        address: "बलाजु, काठमाडौँ",
        phone: "+९७७ ९८५१०९७५४५",
        email: "servicesathi.business@gmail.com",
        contactus: "सम्पर्क गर्नुहोस्",
        form: {
          title: "हामीलाई सम्पर्क गर्नुहोस्",
          firstName: "पहिलो नाम*",
          lastName: "थर*",
          email: "इमेल*",
          phone: "फोन नम्बर*",
          message: "तपाईंको सन्देश...",
          submitButton: "पेश गर्नुहोस्",
        },
        successMessage: "सन्देश सफलतापूर्वक पठाइयो!",
        errorMessage: {
          failed: "सन्देश पठाउन असफल भयो। कृपया पुनः प्रयास गर्नुहोस्!",
          error: "त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्!",
        },
      },
      authForm: {
        welcome: "स्वागत छ",
        toServiceSathi: "सर्भिस साथीमा !",
        signUp: "साइन अप",
        login: "लग - इन",
        fullName: "पूरा नाम",
        email: "इमेल",
        password: "पासवर्ड",
        confirmPassword: "पासवर्ड पुष्टि गर्नुहोस्",
        forgotPassword: "पासवर्ड बिर्सनुभयो?",
        resendVerificationEmail: "पुन: इमेल पठाउनुहोस्",
        didntReceiveVerification: "तपाईंले प्रमाणिकरण इमेल प्राप्त गर्नुभएन?",
        alreadyHaveAccount: "पहिले नै खाता छ?",
        dontHaveAccount: "खाता छैन?",
        userRegistered:
          "प्रयोगकर्ता दर्ता भयो। कृपया तपाईंको इमेल प्रमाणिकरण लिंकको लागि जाँच गर्नुहोस्।",
        verificationEmailSent: "प्रमाणिकरण इमेल पठाइयो।",
        failedToResendEmail: "इमेल पुन: पठाउन असफल। फेरि प्रयास गर्नुहोस्!",
        errorOccurred: "त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्!",
      },
      myProfile: {
        contactInformation: "सम्पर्क जानकारी",
        emailId: "इमेल आईडी:",
        phone: "फोन:",
        address: "ठेगाना:",
        otherInformation: "अन्य जानकारी",
        gender: "लिङ्ग:",
        male: "पुरुष",
        female: "महिला",
        birthday: "जन्मदिन:",
        saveInformation: "जानकारी बचत गर्नुहोस्",
        edit: "सम्पादन गर्नुहोस्",
      },
      myBookingss: {
        title: "मेरो बुकिङहरू",
        orderStatus: "अर्डरको स्थिति:",
        serviceProvider: "सेवा प्रदायक:",
        amount: "रकम:",
        dateTime: "मिति र समय:",
        cancelBooking: "बुकिङ रद्ध गर्नुहोस्",
        noBookings: "कुनै बुकिङ उपलब्ध छैन।",
        completedBookings: "पूरा भएका बुकिङहरू",
        completed: "पूरा",
        review: "समीक्षा छोड्नुहोस्",
        reviewTitle: "समीक्षा छोड्नुहोस्",
        rating: "रेटिङ:",
        comment: "टिप्पणी:",
        submit: "समीक्षा पेश गर्नुहोस्",
        close: "बन्द गर्नुहोस्",
        cancelled: " रद्ध गरिएको",
        noOrder: "इतिहासमा कुनै अर्डर भेटिएन।",
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
