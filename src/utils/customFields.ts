export interface CustomField {
  label: string;
  english_label: string;
  meta_key: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'boolean' | 'date';
  options?: string[];
  english_options?: string[];
  required?: boolean;
}

export interface ListingGuideField {
  key: string;
  label: string;
  english_label: string;
  required?: boolean;
  persisted?: boolean;
  notes?: string;
}

export interface ListingFieldGuide {
  basic: ListingGuideField[];
  required: ListingGuideField[];
  location: ListingGuideField[];
  additional: CustomField[];
}

export const customFieldsByCategory: Record<string, CustomField[]> = {
  cars: [
    {
      label: "الحالة",
      english_label: "Condition",
      meta_key: "listing_condition",
      type: "select",
      options: ["مستعمل", "جديد"],
      english_options: ["Used", "New"],
      required: false
    },
    { 
      label: "نوع المركبة", 
      english_label: "Vehicle Type", 
      meta_key: "vehicle_type", 
      type: "select", 
      options: ["سيدان", "عائلية", "دفع رباعي", "بيك اب", "رياضية", "حافلة", "أخرى"],
      english_options: ["Sedan", "Family SUV", "Drivetrain 4x4", "Pick-up", "Sports Car", "Bus", "Other"]
    },
    { label: "الماركة", english_label: "Vehicle Make", meta_key: "vehicle_make", type: "text" },
    { label: "الموديل", english_label: "Vehicle Model", meta_key: "vehicle_model", type: "text" },
    { label: "سنة الصنع", english_label: "Vehicle Year", meta_key: "vehicle_year", type: "number" },
    { label: "الممشى", english_label: "Mileage", meta_key: "vehicle_mileage", type: "number" },
    { label: "اللون", english_label: "Vehicle Color", meta_key: "vehicle_color", type: "text" },
    { 
      label: "نوع الوقود", 
      english_label: "Fuel Type", 
      meta_key: "fuel_type", 
      type: "select", 
      options: ["بنزين", "ديزل", "هجين (هايبرد)", "كهربائي", "أخرى"],
      english_options: ["Petrol", "Diesel", "Hybrid", "Electric", "Other"]
    },
    { 
      label: "ناقل الحركة", 
      english_label: "Transmission Type", 
      meta_key: "transmission_type", 
      type: "select", 
      options: ["أوتوماتيك", "عادي (قير عادي)", "أخرى"],
      english_options: ["Automatic", "Manual", "Other"]
    },
    { 
      label: "الدفع", 
      english_label: "Drivetrain", 
      meta_key: "drivetrain", 
      type: "select", 
      options: ["دفع خلفي", "دفع أمامي", "دفع رباعي مستمر", "دفع رباعي دبل", "أخرى"],
      english_options: ["RWD", "FWD", "AWD", "4WD", "Other"]
    },
    { 
      label: "نوع الهيكل", 
      english_label: "Body Type", 
      meta_key: "body_type", 
      type: "select", 
      options: ["سيدان", "SUV", "هاتشباك", "كوبيه", "مكشوفة (كابريو)", "بيك اب", "فان", "أخرى"],
      english_options: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Pickup", "Van", "Other"]
    },
    { label: "حجم المحرك", english_label: "Engine Size", meta_key: "engine_size", type: "text" },
    { label: "عدد السلندرات", english_label: "Cylinders", meta_key: "cylinders", type: "number" },
    { label: "عدد الأبواب", english_label: "Doors Count", meta_key: "doors_count", type: "number" },
    { label: "عدد المقاعد", english_label: "Seats Count", meta_key: "seats_count", type: "number" },
    { label: "نوع اللوحة", english_label: "Plate Type", meta_key: "plate_type", type: "text" },
    { label: "رقم اللوحة", english_label: "Plate Number", meta_key: "plate_number", type: "text" },
    { label: "تاريخ صلاحية الاستمارة", english_label: "Registration Valid Until", meta_key: "registration_valid_until", type: "date" },
    { label: "سجل الحوادث", english_label: "Accident History", meta_key: "accident_history", type: "textarea" },
    { label: "سجل الصيانة", english_label: "Service History", meta_key: "service_history", type: "textarea" },
    { 
      label: "الضمان", 
      english_label: "Warranty Status", 
      meta_key: "warranty_status", 
      type: "select", 
      options: ["تحت الضمان", "منتهي الضمان", "بدون ضمان", "أخرى"],
      english_options: ["Under Warranty", "Expired Warranty", "No Warranty", "Other"]
    },
    { 
      label: "حالة الاستيراد", 
      english_label: "Import Status", 
      meta_key: "import_status", 
      type: "select", 
      options: ["وارد الوكالة (سعودي)", "استيراد خليجي", "استيراد أمريكي", "استيراد أوروبي", "استيراد كوري", "أخرى"],
      english_options: ["Agency Import (Saudi)", "Gulf Import", "US Import", "European Import", "Korean Import", "Other"]
    },
    { label: "رقم الهيكل", english_label: "VIN Number", meta_key: "vin_number", type: "text" }
  ],
  "real-estate": [
    { 
      label: "نوع العقار", 
      english_label: "Property Type", 
      meta_key: "property_type", 
      type: "select", 
      options: ["شقة", "فيلا", "أرض", "دور", "عماره", "محل", "مكتب", "مستودع", "استراحة", "شاليه", "أخرى"],
      english_options: ["Apartment", "Villa", "Land", "Floor", "Building", "Shop", "Office", "Warehouse", "Rest house", "Chalet", "Other"]
    },
    { 
      label: "نوع العرض", 
      english_label: "Offering Type", 
      meta_key: "offering_type", 
      type: "select", 
      options: ["للبيع", "للإيجار سنوي", "للإيجار شهري", "للإيجار يومي", "أخرى"],
      english_options: ["For Sale", "Yearly Rent", "Monthly Rent", "Daily Rent", "Other"]
    },
    { label: "المساحة", english_label: "Property Area", meta_key: "property_area", type: "number" },
    { 
      label: "وحدة المساحة", 
      english_label: "Area Unit", 
      meta_key: "area_unit", 
      type: "select", 
      options: ["متر مربع", "قدم مربع", "أخرى"],
      english_options: ["Square Meter (sqm)", "Square Feet (sqft)", "Other"]
    },
    { label: "عدد غرف النوم", english_label: "Bedrooms Count", meta_key: "bedrooms_count", type: "number" },
    { label: "عدد دورات المياه", english_label: "Bathrooms Count", meta_key: "bathrooms_count", type: "number" },
    { label: "عدد الصالات", english_label: "Living Rooms Count", meta_key: "living_rooms_count", type: "number" },
    { label: "عدد الأدوار", english_label: "Floors Count", meta_key: "floors_count", type: "number" },
    { 
      label: "التأثيث", 
      english_label: "Furnishing Status", 
      meta_key: "furnishing_status", 
      type: "select", 
      options: ["مفروش بالكامل", "شبه مفروش", "غير مفروش", "أخرى"],
      english_options: ["Fully Furnished", "Semi Furnished", "Unfurnished", "Other"]
    },
    { label: "عمر العقار", english_label: "Property Age", meta_key: "property_age", type: "text" },
    { label: "واجهة العقار", english_label: "Property Facing", meta_key: "property_facing", type: "text" },
    { label: "الخدمات والمرافق", english_label: "Property Utilities", meta_key: "property_utilities", type: "textarea" },
    { label: "موقف سيارة", english_label: "Parking Available", meta_key: "parking_available", type: "boolean" },
    { label: "غرفة خادمة", english_label: "Maid Room Available", meta_key: "maid_room_available", type: "boolean" },
    { label: "غرفة سائق", english_label: "Driver Room Available", meta_key: "driver_room_available", type: "boolean" },
    { label: "مصعد", english_label: "Elevator Available", meta_key: "elevator_available", type: "boolean" },
    { label: "مسبح", english_label: "Pool Available", meta_key: "pool_available", type: "boolean" },
    { label: "حديقة", english_label: "Garden Available", meta_key: "garden_available", type: "boolean" },
    { label: "الإيجار الشهري", english_label: "Monthly Rent", meta_key: "monthly_rent", type: "number" },
    { label: "الإيجار السنوي", english_label: "Yearly Rent", meta_key: "yearly_rent", type: "number" },
    { 
      label: "حالة الملكية", 
      english_label: "Ownership Status", 
      meta_key: "ownership_status", 
      type: "select", 
      options: ["حر", "مرهون", "أخرى"],
      english_options: ["Freehold", "Mortgaged", "Other"]
    },
    { 
      label: "حالة الصك", 
      english_label: "Title Deed Status", 
      meta_key: "title_deed_status", 
      type: "select", 
      options: ["إلكتروني موثق", "ورقي", "بدون صك", "أخرى"],
      english_options: ["Electronic & Verified", "Paper deed", "Without deed", "Other"]
    }
  ],
  jobs: [
    { label: "المسمى الوظيفي", english_label: "Job Title", meta_key: "job_title", type: "text" },
    { 
      label: "نوع الوظيفة", 
      english_label: "Job Type", 
      meta_key: "job_type", 
      type: "select", 
      options: ["دوام كامل", "دوام جزئي", "عقد مؤقت", "تدريب", "أخرى"],
      english_options: ["Full Time", "Part Time", "Contract", "Internship", "Other"]
    },
    { label: "القطاع", english_label: "Industry Type", meta_key: "industry_type", type: "text" },
    { 
      label: "نوع التوظيف", 
      english_label: "Employment Type", 
      meta_key: "employment_type", 
      type: "select", 
      options: ["حضوري", "عن بعد", "هجين", "أخرى"],
      english_options: ["On-site", "Remote", "Hybrid", "Other"]
    },
    { 
      label: "مكان العمل", 
      english_label: "Workplace Type", 
      meta_key: "workplace_type", 
      type: "select", 
      options: ["داخل المنشأة", "ميداني", "أخرى"],
      english_options: ["Office/Factory", "Field work", "Other"]
    },
    { 
      label: "تفضيل الجنس", 
      english_label: "Gender Preference", 
      meta_key: "gender_preference", 
      type: "select", 
      options: ["لا يهم", "ذكور فقط", "إناث فقط", "أخرى"],
      english_options: ["No Preference", "Male Only", "Female Only", "Other"]
    },
    { label: "تفضيل الجنسية", english_label: "Nationality Preference", meta_key: "nationality_preference", type: "text" },
    { label: "الراتب الأدنى", english_label: "Salary Min", meta_key: "salary_min", type: "number" },
    { label: "الراتب الأعلى", english_label: "Salary Max", meta_key: "salary_max", type: "number" },
    { 
      label: "فترة الراتب", 
      english_label: "Salary Period", 
      meta_key: "salary_period", 
      type: "select", 
      options: ["شهري", "أسبوعي", "يومي", "بالساعة", "أخرى"],
      english_options: ["Monthly", "Weekly", "Daily", "Hourly", "Other"]
    },
    { label: "سنوات الخبرة المطلوبة", english_label: "Required Experience Years", meta_key: "required_experience_years", type: "number" },
    { 
      label: "المؤهل التعليمي", 
      english_label: "Education Level", 
      meta_key: "education_level", 
      type: "select", 
      options: ["ثانوي", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه", "دون مؤهل", "أخرى"],
      english_options: ["High School", "Diploma", "Bachelors", "Masters", "PhD", "No Degree", "Other"]
    },
    { label: "متطلبات اللغة", english_label: "Language Requirements", meta_key: "language_requirements", type: "textarea" },
    { label: "المهارات المطلوبة", english_label: "Skills Required", meta_key: "skills_required", type: "textarea" },
    { label: "حالة التأشيرة المطلوبة", english_label: "Visa Status Required", meta_key: "visa_status_required", type: "text" },
    { label: "السكن متوفر", english_label: "Accommodation Provided", meta_key: "accommodation_provided", type: "boolean" },
    { label: "المواصلات متوفرة", english_label: "Transportation Provided", meta_key: "transportation_provided", type: "boolean" },
    { label: "موعد المباشرة", english_label: "Joining Time", meta_key: "joining_time", type: "text" },
    { label: "السيرة الذاتية (ملخص أو خبرات)", english_label: "Resume / CV (Summary or Experience)", meta_key: "resume_cv_summary", type: "textarea" },
    { label: "رابط ملف السيرة الذاتية (PDF / Drive / LinkedIn)", english_label: "CV / Resume Link (PDF / Drive / LinkedIn)", meta_key: "resume_cv_link", type: "text" }
  ],

  services: [
    { label: "نوع الخدمة", english_label: "Service Type", meta_key: "service_type", type: "text" },
    { 
      label: "طريقة تقديم الخدمة", 
      english_label: "Service Mode", 
      meta_key: "service_mode", 
      type: "select", 
      options: ["حضور لموقع العميل", "في مقر مقدم الخدمة", "عن بعد عبر الإنترنت", "أخرى"],
      english_options: ["At Client Location", "At Service Provider Location", "Online/Remote", "Other"]
    },
    { label: "نطاق التغطية", english_label: "Service Coverage Area", meta_key: "service_coverage_area", type: "text" },
    { label: "مدة الخدمة", english_label: "Service Duration", meta_key: "service_duration", type: "text" },
    { label: "يتطلب حجز", english_label: "Booking Required", meta_key: "booking_required", type: "boolean" },
    { label: "تتوفر زيارة للموقع", english_label: "Visit Available", meta_key: "visit_available", type: "boolean" },
    { label: "خدمة طوارئ", english_label: "Emergency Service Available", meta_key: "emergency_service_available", type: "boolean" },
    { label: "سنوات الخبرة", english_label: "Experience Years", meta_key: "experience_years", type: "number" },
    { label: "لغات الخدمة", english_label: "Service Languages", meta_key: "service_languages", type: "text" },
    { label: "رابط الأعمال السابقة", english_label: "Portfolio URL", meta_key: "portfolio_url", type: "text" },
    { 
      label: "نوع التسعير", 
      english_label: "Service Pricing Type", 
      meta_key: "service_pricing_type", 
      type: "select", 
      options: ["سعر ثابت", "يبدأ من", "حسب الاتفاق", "سعر بالساعة", "أخرى"],
      english_options: ["Fixed Price", "Starts from", "By agreement", "Hourly rate", "Other"]
    },
    { label: "السعر يبدأ من", english_label: "Starting Price", meta_key: "starting_price", type: "number" }
  ],
  electronics: [
    {
      label: "الحالة",
      english_label: "Condition",
      meta_key: "listing_condition",
      type: "select",
      options: ["مستعمل", "جديد"],
      english_options: ["Used", "New"],
      required: false
    },
    { label: "العلامة التجارية", english_label: "Brand Name", meta_key: "brand_name", type: "text" },
    { label: "اسم الموديل", english_label: "Model Name", meta_key: "model_name", type: "text" },
    { label: "سنة الإصدار", english_label: "Release Year", meta_key: "release_year", type: "number" },
    { label: "السعة التخزينية", english_label: "Storage Capacity", meta_key: "storage_capacity", type: "text" },
    { label: "الرام", english_label: "RAM Size", meta_key: "ram_size", type: "text" },
    { label: "نوع المعالج", english_label: "Processor Type", meta_key: "processor_type", type: "text" },
    { label: "حجم الشاشة", english_label: "Screen Size", meta_key: "screen_size", type: "text" },
    { label: "خيارات الاتصال", english_label: "Connectivity Options", meta_key: "connectivity_options", type: "text" },
    { label: "نظام التشغيل", english_label: "Operating System", meta_key: "operating_system", type: "text" },
    { label: "صحة البطارية", english_label: "Battery Health", meta_key: "battery_health", type: "text" },
    { label: "الملحقات المرفقة", english_label: "Accessories Included", meta_key: "accessories_included", type: "textarea" },
    { label: "توفر العلبة الأصلية", english_label: "Original Box Available", meta_key: "original_box_available", type: "boolean" },
    { 
      label: "الضمان", 
      english_label: "Warranty Status", 
      meta_key: "warranty_status", 
      type: "select", 
      options: ["تحت الضمان", "منتهي الضمان", "بدون ضمان", "أخرى"],
      english_options: ["Under Warranty", "Expired Warranty", "No Warranty", "Other"]
    },
    { label: "الرقم التسلسلي", english_label: "Serial Number", meta_key: "serial_number", type: "text" }
  ],
  "home-furniture": [
    { label: "نوع الأثاث", english_label: "Furniture Type", meta_key: "furniture_type", type: "text" },
    { label: "نوع الخامة", english_label: "Material Type", meta_key: "material_type", type: "text" },
    { label: "الأبعاد", english_label: "Dimensions", meta_key: "dimensions", type: "text" },
    { label: "اللون", english_label: "Color", meta_key: "color", type: "text" },
    { label: "عدد القطع", english_label: "Pieces Count", meta_key: "pieces_count", type: "number" },
    { label: "يحتاج تركيب", english_label: "Assembly Required", meta_key: "assembly_required", type: "boolean" },
    { 
      label: "حالة الاستخدام", 
      english_label: "Usage Status", 
      meta_key: "usage_status", 
      type: "select", 
      options: ["جديد غير مستخدم", "مستعمل بحالة ممتازة", "مستعمل بحالة جيدة", "مستعمل متوسط", "أخرى"],
      english_options: ["Brand New", "Excellent Used", "Good Used", "Fair Used", "Other"]
    },
    { label: "التوصيل متوفر", english_label: "Delivery Available", meta_key: "delivery_available", type: "boolean" },
    { label: "العلامة التجارية", english_label: "Brand Name", meta_key: "brand_name", type: "text" }
  ],
  "fashion-beauty": [
    { label: "نوع المنتج", english_label: "Product Type", meta_key: "product_type", type: "text" },
    { 
      label: "الفئة المستهدفة", 
      english_label: "Gender Type", 
      meta_key: "gender_type", 
      type: "select", 
      options: ["رجال", "نساء", "للجنسين", "أطفال أولاد", "أطفال بنات", "أخرى"],
      english_options: ["Men", "Women", "Unisex", "Boys", "Girls", "Other"]
    },
    { label: "المقاس", english_label: "Size", meta_key: "size", type: "text" },
    { label: "اللون", english_label: "Color", meta_key: "color", type: "text" },
    { label: "نوع الخامة", english_label: "Material Type", meta_key: "material_type", type: "text" },
    { label: "العلامة التجارية", english_label: "Brand Name", meta_key: "brand_name", type: "text" },
    { 
      label: "الأصالة", 
      english_label: "Authenticity Status", 
      meta_key: "authenticity_status", 
      type: "select", 
      options: ["أصلي 100%", "درجة أولى مكرر", "تقليد", "أخرى"],
      english_options: ["100% Authentic", "High Copy", "Replica", "Other"]
    },
    { 
      label: "حالة الاستخدام", 
      english_label: "Usage Status", 
      meta_key: "usage_status", 
      type: "select", 
      options: ["جديد ببطاقة السعر", "جديد بدون بطاقة السعر", "مستعمل بحالة ممتازة", "مستعمل بحالة جيدة", "أخرى"],
      english_options: ["New with tags", "New without tags", "Excellent Used", "Good Used", "Other"]
    },
    { label: "حجم العطر", english_label: "Perfume Volume", meta_key: "perfume_volume", type: "text" },
    { label: "تاريخ الانتهاء", english_label: "Expiration Date", meta_key: "expiration_date", type: "date" }
  ],
  "mother-baby": [
    { label: "نوع المنتج", english_label: "Product Type", meta_key: "product_type", type: "text" },
    { label: "الفئة العمرية", english_label: "Child Age Range", meta_key: "child_age_range", type: "text" },
    { label: "المقاس", english_label: "Size", meta_key: "size", type: "text" },
    { label: "معيار السلامة", english_label: "Safety Standard", meta_key: "safety_standard", type: "text" },
    { label: "نوع الخامة", english_label: "Material Type", meta_key: "material_type", type: "text" },
    { label: "العلامة التجارية", english_label: "Brand Name", meta_key: "brand_name", type: "text" },
    { 
      label: "حالة الاستخدام", 
      english_label: "Usage Status", 
      meta_key: "usage_status", 
      type: "select", 
      options: ["جديد", "مستعمل بحالة ممتازة", "مستعمل بحالة جيدة", "أخرى"],
      english_options: ["New", "Excellent Used", "Good Used", "Other"]
    },
    { label: "الملحقات المرفقة", english_label: "Accessories Included", meta_key: "accessories_included", type: "textarea" }
  ],
  "pets-animals": [
    { label: "نوع الحيوان", english_label: "Animal Type", meta_key: "animal_type", type: "text" },
    { label: "السلالة", english_label: "Breed", meta_key: "breed", type: "text" },
    { 
      label: "الجنس", 
      english_label: "Gender", 
      meta_key: "gender", 
      type: "select", 
      options: ["ذكر", "أنثى", "زوج", "أخرى"],
      english_options: ["Male", "Female", "Pair", "Other"]
    },
    { label: "العمر", english_label: "Age", meta_key: "age", type: "number" },
    { 
      label: "وحدة العمر", 
      english_label: "Age Unit", 
      meta_key: "age_unit", 
      type: "select", 
      options: ["أيام", "أسابيع", "أشهر", "سنوات"],
      english_options: ["Days", "Weeks", "Months", "Years"]
    },
    { label: "اللون", english_label: "Color", meta_key: "color", type: "text" },
    { 
      label: "حالة التطعيم", 
      english_label: "Vaccination Status", 
      meta_key: "vaccination_status", 
      type: "select", 
      options: ["مطعم بالكامل", "مطعم جزئياً", "غير مطعم", "غير معروف", "أخرى"],
      english_options: ["Fully Vaccinated", "Partially Vaccinated", "Not Vaccinated", "Unknown", "Other"]
    },
    { label: "يوجد جواز", english_label: "Passport Available", meta_key: "passport_available", type: "boolean" },
    { label: "يوجد نسب / شهادة", english_label: "Pedigree Available", meta_key: "pedigree_available", type: "boolean" },
    { label: "حالة التدريب", english_label: "Training Status", meta_key: "training_status", type: "text" },
    { label: "الحالة الصحية", english_label: "Health Status", meta_key: "health_status", type: "textarea" },
    { label: "التوصيل متوفر", english_label: "Delivery Available", meta_key: "delivery_available", type: "boolean" }
  ],
  "sports-hobbies": [
    { label: "نوع العنصر", english_label: "Item Type", meta_key: "item_type", type: "text" },
    { label: "العلامة التجارية", english_label: "Brand Name", meta_key: "brand_name", type: "text" },
    { label: "اسم الموديل", english_label: "Model Name", meta_key: "model_name", type: "text" },
    { label: "المقاس", english_label: "Size", meta_key: "size", type: "text" },
    { label: "الوزن", english_label: "Weight", meta_key: "weight", type: "text" },
    { label: "نوع الخامة", english_label: "Material Type", meta_key: "material_type", type: "text" },
    { 
      label: "حالة الاستخدام", 
      english_label: "Usage Status", 
      meta_key: "usage_status", 
      type: "select", 
      options: ["جديد", "مستعمل بحالة ممتازة", "مستعمل بحالة جيدة", "أخرى"],
      english_options: ["New", "Excellent Used", "Good Used", "Other"]
    },
    { label: "الفئة العمرية", english_label: "Age Group", meta_key: "age_group", type: "text" },
    { label: "تاريخ الفعالية", english_label: "Event Date", meta_key: "event_date", type: "date" },
    { label: "عدد التذاكر", english_label: "Ticket Count", meta_key: "ticket_count", type: "number" },
    { label: "بيانات المقاعد", english_label: "Seat Info", meta_key: "seat_info", type: "text" }
  ],
  "business-industry": [
    { label: "نوع المعدة", english_label: "Equipment Type", meta_key: "equipment_type", type: "text" },
    { label: "ماركة الآلة", english_label: "Machine Brand", meta_key: "machine_brand", type: "text" },
    { label: "موديل الآلة", english_label: "Machine Model", meta_key: "machine_model", type: "text" },
    { label: "الطاقة الإنتاجية", english_label: "Production Capacity", meta_key: "production_capacity", type: "text" },
    { label: "متطلبات الطاقة", english_label: "Power Requirements", meta_key: "power_requirements", type: "text" },
    { 
      label: "حالة المعدة", 
      english_label: "Condition Grade", 
      meta_key: "condition_grade", 
      type: "select", 
      options: ["جديد", "مستعمل ممتاز", "مستعمل بحالة جيدة", "بحاجة لصيانة", "أخرى"],
      english_options: ["New", "Excellent Used", "Good Used", "Maintenance Required", "Other"]
    },
    { label: "التركيب متوفر", english_label: "Installation Available", meta_key: "installation_available", type: "boolean" },
    { label: "التدريب متوفر", english_label: "Training Available", meta_key: "training_available", type: "boolean" },
    { label: "اسم الشركة", english_label: "Company Name", meta_key: "company_name", type: "text" },
    { label: "نوع النشاط", english_label: "Business Type", meta_key: "business_type", type: "text" },
    { label: "الإيراد الشهري", english_label: "Monthly Revenue", meta_key: "monthly_revenue", type: "number" },
    { label: "المصروفات الشهرية", english_label: "Monthly Expenses", meta_key: "monthly_expenses", type: "number" },
    { label: "عدد الموظفين", english_label: "Staff Count", meta_key: "staff_count", type: "number" },
    { 
      label: "حالة الترخيص", 
      english_label: "License Status", 
      meta_key: "license_status", 
      type: "select", 
      options: ["نشط وساري", "منتهي", "غير متوفر", "أخرى"],
      english_options: ["Active & Valid", "Expired", "Not Available", "Other"]
    }
  ],
  "food-home-kitchens": [
    { label: "نوع الطعام", english_label: "Food Type", meta_key: "food_type", type: "text" },
    { label: "نوع المطبخ", english_label: "Cuisine Type", meta_key: "cuisine_type", type: "text" },
    { label: "سعر التوصيل التقريبي", english_label: "Estimated Delivery Price", meta_key: "delivery_fee", type: "number" },
    { label: "عنوان الاستلام بالتفصيل", english_label: "Pickup Address", meta_key: "pickup_address", type: "text" },
    { label: "مناطق التوصيل المغطاة", english_label: "Delivery Areas Covered", meta_key: "delivery_areas", type: "text" },
    { label: "يقبل التوصيل للمزارع والاستراحات", english_label: "Delivers to Farms and Resthouses", meta_key: "delivers_to_places", type: "boolean" },
    { label: "التوصيل متوفر", english_label: "Delivery Available", meta_key: "delivery_available", type: "boolean" },
    { label: "حجم الحصة", english_label: "Portion Size", meta_key: "portion_size", type: "text" },
    { label: "ملخص المكونات", english_label: "Ingredients Summary", meta_key: "ingredients_summary", type: "textarea" },
    { label: "معلومات الحساسية", english_label: "Allergens Info", meta_key: "allergens_info", type: "textarea" },
    { label: "مدة التحضير", english_label: "Preparation Time", meta_key: "preparation_time", type: "text" },
    { label: "يصنع حسب الطلب", english_label: "Made to Order", meta_key: "made_to_order", type: "boolean" },
    { label: "مدة الصلاحية", english_label: "Shelf Life", meta_key: "shelf_life", type: "text" },
    { label: "تاريخ الإنتاج", english_label: "Production Date", meta_key: "production_date", type: "date" }
  ],
  "travel-tourism": [
    { label: "نوع الباقة", english_label: "Package Type", meta_key: "package_type", type: "text" },
    { label: "دولة الوجهة", english_label: "Destination Country", meta_key: "destination_country", type: "text" },
    { label: "مدينة الوجهة", english_label: "Destination City", meta_key: "destination_city", type: "text" },
    { label: "تاريخ المغادرة", english_label: "Departure Date", meta_key: "departure_date", type: "date" },
    { label: "تاريخ العودة", english_label: "Return Date", meta_key: "return_date", type: "date" },
    { label: "المدة بالأيام", english_label: "Duration Days", meta_key: "duration_days", type: "number" },
    { 
      label: "تصنيف الفندق", 
      english_label: "Hotel Rating", 
      meta_key: "hotel_rating", 
      type: "select", 
      options: ["1 نجمة", "2 نجمتان", "3 نجوم", "4 نجوم", "5 نجوم", "غير مصنف", "أخرى"],
      english_options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars", "Unrated", "Other"]
    },
    { label: "يشمل النقل", english_label: "Transport Included", meta_key: "transport_included", type: "boolean" },
    { label: "يشمل التأشيرة", english_label: "Visa Included", meta_key: "visa_included", type: "boolean" },
    { label: "يشمل التأمين", english_label: "Insurance Included", meta_key: "insurance_included", type: "boolean" },
    { label: "حجم المجموعة", english_label: "Group Size", meta_key: "group_size", type: "number" }
  ],
  "buy-sell-misc": [
    { label: "نوع العنصر", english_label: "Item Type", meta_key: "item_type", type: "text" },
    { label: "العلامة التجارية", english_label: "Brand Name", meta_key: "brand_name", type: "text" },
    { label: "اسم الموديل", english_label: "Model Name", meta_key: "model_name", type: "text" },
    { label: "الكمية", english_label: "Quantity", meta_key: "quantity", type: "number" },
    { label: "نوع الوحدة", english_label: "Unit Type", meta_key: "unit_type", type: "text" },
    { label: "اللون", english_label: "Color", meta_key: "color", type: "text" },
    { label: "المقاس", english_label: "Size", meta_key: "size", type: "text" },
    { label: "نوع الخامة", english_label: "Material Type", meta_key: "material_type", type: "text" },
    { 
      label: "حالة الاستخدام", 
      english_label: "Usage Status", 
      meta_key: "usage_status", 
      type: "select", 
      options: ["جديد", "مستعمل بحالة ممتازة", "مستعمل بحالة جيدة", "أخرى"],
      english_options: ["New", "Excellent Used", "Good Used", "Other"]
    }
  ],
  "places-venues": [
    { label: "السعة الاستيعابية لعدد الضيوف", english_label: "Guest Capacity", meta_key: "guest_capacity", type: "number" },
    { label: "العنوان بالتفصيل للمكان", english_label: "Detailed Address", meta_key: "detailed_address", type: "text" },
    { label: "إحداثيات الموقع / رابط الخريطة", english_label: "Map Coordinates Link", meta_key: "map_link", type: "text" },
    { label: "التوصيل مسموح ومتاح للموقع", english_label: "Food Delivery Allowed", meta_key: "food_delivery_allowed", type: "boolean" },
    { label: "توجيهات وإرشادات التوصيل للسائق", english_label: "Delivery Instructions", meta_key: "delivery_instructions", type: "textarea" },
    { label: "يتوفر مطبخ للطهي", english_label: "Kitchen Available", meta_key: "kitchen_available", type: "boolean" },
    { label: "مرافق ترفيهية متوفرة", english_label: "Entertainment Facilities", meta_key: "entertainment_facilities", type: "textarea" },
    { label: "رقم تواصل حارس المكان", english_label: "Keeper Contact Number", meta_key: "keeper_contact", type: "text" }
  ],
  "delivery-shipping": [
    { 
      label: "وسيلة النقل", 
      english_label: "Transport Vehicle", 
      meta_key: "transport_vehicle", 
      type: "select", 
      options: ["دراجة نارية", "سيارة صغيرة", "سيارة عائلية", "وانيت / ددسن", "دينا / شاحنة", "أخرى"],
      english_options: ["Motorcycle", "Sedan", "SUV", "Pickup Truck", "Lorry/Truck", "Other"]
    },
    { label: "موقع التواجد الحالي / نقطة الانطلاق", english_label: "Starting Location", meta_key: "starting_location", type: "text" },
    { label: "مناطق التغطية والتوصيل", english_label: "Delivery Coverage Areas", meta_key: "delivery_coverage", type: "text" },
    { label: "سعر التوصيل التقريبي", english_label: "Estimated Delivery Price", meta_key: "estimated_price", type: "number" },
    { label: "مستعد للتوصيل للأماكن النائية (مزارع/استراحات)", english_label: "Delivers to Remote Places (Farms/Resthouses)", meta_key: "delivers_to_remote", type: "boolean" }
  ]
};

// Helper function to map a specific subcategory key to its parent category fields
export function getCustomFieldsByCategoryKey(key: string): CustomField[] {
  if (!key) return [];
  
  if (key.startsWith('cars') || key === 'classic-cars' || key === 'luxury-cars' || key === 'scrap-cars' || key === 'special-plates' || key.startsWith('car-') || key === 'tires-batteries') {
    return customFieldsByCategory.cars;
  }
  
  if (key.includes('apartment') || key.includes('villa') || key === 'lands' || key === 'buildings' || key === 'offices-shops' || key === 'warehouses' || key === 'chalets-resthouses' || key === 'shared-housing') {
    return customFieldsByCategory['real-estate'];
  }
  
  if (key.includes('job') || key === 'internships' || key === 'drivers-delivery-jobs' || key === 'admin-jobs' || key === 'tech-jobs' || key === 'sales-marketing-jobs' || key === 'skilled-labor-jobs') {
    return customFieldsByCategory.jobs;
  }
  
  if (key === 'delivery-shipping') {
    return customFieldsByCategory['delivery-shipping'];
  }
  
  if (key.includes('service') || key === 'moving-shipping' || key === 'maintenance-services' || key === 'cleaning-services' || key === 'tech-services' || key === 'design-printing' || key === 'marketing-services' || key === 'legal-services' || key === 'accounting-services' || key === 'education-training-services' || key === 'events-services') {
    return customFieldsByCategory.services;
  }
  
  if (key === 'mobiles' || key === 'tablets' || key === 'laptops' || key === 'computers' || key === 'tv-screens' || key === 'cameras' || key === 'audio-devices' || key === 'gaming-devices' || key === 'networking-devices' || key === 'electronic-parts') {
    return customFieldsByCategory.electronics;
  }
  
  if (key.includes('furniture') || key === 'kitchen-home-tools' || key === 'decor-lighting' || key === 'carpets-bedding' || key === 'home-appliances' || key === 'garden-supplies') {
    return customFieldsByCategory['home-furniture'];
  }
  
  if (key.includes('fashion') || key === 'shoes' || key === 'bags-accessories' || key === 'watches-jewelry' || key === 'perfumes' || key === 'cosmetics' || key === 'personal-care') {
    return customFieldsByCategory['fashion-beauty'];
  }
  
  if (key === 'strollers-beds' || key === 'baby-clothes' || key === 'kids-toys' || key === 'feeding-supplies' || key === 'nursery-supplies' || key === 'child-car-seats') {
    return customFieldsByCategory['mother-baby'];
  }
  
  if (key === 'cats' || key === 'dogs' || key === 'birds' || key === 'fish' || key === 'horses' || key === 'livestock-feed' || key === 'pet-supplies' || key === 'veterinary-services') {
    return customFieldsByCategory['pets-animals'];
  }
  
  if (key === 'fitness-equipment' || key === 'bicycles' || key === 'camping-outdoor' || key === 'hunting-shooting' || key === 'books' || key === 'musical-instruments' || key === 'collectibles-hobbies' || key === 'tickets-events') {
    return customFieldsByCategory['sports-hobbies'];
  }
  
  if (key === 'industrial-equipment' || key === 'restaurant-cafe-equipment' || key === 'medical-equipment' || key === 'agricultural-equipment' || key === 'construction-materials' || key === 'business-opportunities' || key === 'franchise-opportunities' || key === 'businesses-for-sale') {
    return customFieldsByCategory['business-industry'];
  }
  
  if (key === 'home-cooked-meals' || key === 'desserts-bakery' || key === 'catering-events' || key === 'homemade-products' || key === 'drinks-coffee' || key === 'restaurants' || key === 'cafes-sweets' || key === 'tea-cafes') {
    return customFieldsByCategory['food-home-kitchens'];
  }
  
  if (key === 'farms-rental' || key === 'resthouses-rental' || key === 'chalets-resorts' || key === 'beach-camps' || key === 'event-halls') {
    return customFieldsByCategory['places-venues'];
  }
  
  if (key === 'hotels-bookings' || key === 'tours' || key === 'tourist-car-rental' || key === 'travel-packages' || key === 'tourism-services') {
    return customFieldsByCategory['travel-tourism'];
  }
  
  if (key === 'used-items' || key === 'gifts' || key === 'rare-items' || key === 'seasonal-products' || key === 'used-items') {
    return customFieldsByCategory['buy-sell-misc'];
  }
  
  return [];
}

const listingBasicFields: ListingGuideField[] = [
  { key: 'title', label: 'عنوان الإعلان', english_label: 'Ad Title', required: true },
  { key: 'description', label: 'الوصف', english_label: 'Description', required: true },
  { key: 'image', label: 'الصورة', english_label: 'Image', required: true },
  { key: 'rating', label: 'التقييم', english_label: 'Rating', persisted: false, notes: 'Virtual presentation field' },
  { key: 'comment', label: 'التعليق', english_label: 'Comment', persisted: false, notes: 'Virtual presentation field' }
];

const listingRequiredFields: ListingGuideField[] = [
  { key: 'price', label: 'السعر', english_label: 'Price', required: true },
  { key: 'currency', label: 'العملة', english_label: 'Currency', required: true },
  { key: 'listing_condition', label: 'الحالة', english_label: 'Condition', required: false },
  { key: 'contact_method', label: 'طريقة التواصل', english_label: 'Contact Method', required: true },
  { key: 'contact_name', label: 'اسم جهة التواصل', english_label: 'Contact Name', required: true },
  { key: 'contact_whatsapp', label: 'رقم الواتساب', english_label: 'WhatsApp Number', required: true }
];

const listingLocationFields: ListingGuideField[] = [
  { key: 'listing_country', label: 'البلد', english_label: 'Country', required: true },
  { key: 'listing_city', label: 'المدينة', english_label: 'City', required: true },
  { key: 'listing_district', label: 'الحي / المنطقة', english_label: 'District', required: true },
  { key: 'listing_street', label: 'الشارع', english_label: 'Street', required: true },
  { key: 'listing_address', label: 'العنوان التفصيلي', english_label: 'Address Details', required: false }
];

export function getListingFieldGuideByCategoryKey(key: string): ListingFieldGuide {
  return {
    basic: listingBasicFields,
    required: listingRequiredFields,
    location: listingLocationFields,
    additional: getCustomFieldsByCategoryKey(key)
  };
}
