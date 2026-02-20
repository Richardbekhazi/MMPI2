// public/translations.js
export const translations = {
  ar: {
    // Page Title
    title: "MMPI-2 | لوحة التحكم",
    
    // Logo & Header
    logoSubtitle: "نظام التقييم النفسي",
    
    // Navigation
    home: "الرئيسية",
    archive: "الأرشيف",
    back: "عودة",
    
    // Welcome Section
    welcomeTitle: "مرحباً بكم في نظام اختبار MMPI",
    welcomeMessage: "منصة احترافية لإدارة الاختبارات النفسية. يمكنك إنشاء ملفات مفحوصين جديدة، إدارة الأرشيف، وتصدير البيانات بسهولة تامة.",
    newUser: "مستخدم جديد",
    
    // New User Form
    createNewRecord: "إنشاء سجل جديد",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "مثال: أحمد محمد",
    age: "العمر",
    agePlaceholder: "0",
    fileNumber: "رقم الملف",
    fileNumberPlaceholder: "مثال: 2023-A01",
    procedureDate: "تاريخ الإجراء",
    gender: "الجنس",
    selectGender: "اختر الجنس...",
    male: "ذكر",
    female: "أنثى",
    
    // Action Buttons
    saveAndCreate: "حفظ وإنشاء",
    archiveAndPreviousUsers: "الأرشيف والمستخدمين السابقين",
    openFile: "فتح الملف",
    clearSelection: "إلغاء التحديد",
    export: "تصدير",
    import: "استيراد",
    copy: "نسخ",
    delete: "حذف",
    
    // User List
    selectUsersMessage: "قم بتحديد المستخدمين لإجراء العمليات",
    noRecords: "لا توجد سجلات محفوظة حالياً",
    
    // Status
    statusNew: "جديد",
    statusInProgress: "قيد الإجراء",
    statusCompleted: "مكتمل",
    
    // Meta Information
    ageYear: "سنة",
    file: "الملف",
    date: "التاريخ",
    
    // Dialogs & Prompts
    enterNewName: "ادخل اسماً جديداً للنسخة:",
    confirmDelete: "هل أنت متأكد من حذف {count} عنصر؟ لا يمكن التراجع.",
    
    // Toast Messages
    toastSuccess: "تم إنشاء الملف بنجاح: {name}",
    toastEnterName: "يرجى إدخال الاسم",
    toastInvalidAge: "يرجى إدخال عمر صالح",
    toastEnterFolder: "يرجى إدخال رقم المجلد",
    toastEnterDate: "يرجى اختيار التاريخ",
    toastEnterGender: "يرجى تحديد الجنس",
    toastUserExists: "يوجد مستخدم مسجل بنفس الاسم مسبقاً",
    toastSelectSingleForOpen: "يرجى اختيار مستخدم واحد فقط للفتح",
    toastSelectUserToExport: "يرجى اختيار مستخدم للتصدير",
    toastExported: "تم تصدير الملفات المحددة",
    toastImported: "تم استيراد: {count} ملف",
    toastSkipped: "تم تخطي {count} ملف (مكرر أو تالف)",
    toastSelectSingleToCopy: "يرجى اختيار مستخدم واحد للنسخ",
    toastNameExists: "الاسم موجود من قبل",
    toastFileNotFound: "الملف الأصلي غير موجود",
    toastCopied: "تم نسخ {original} إلى {newName}",
    toastSelectUserToDelete: "يرجى اختيار مستخدم للحذف",
    toastDeleted: "تم الحذف بنجاح",
    
    // Firebase Messages
    firebaseSaveSuccess: "تم حفظ البيانات بنجاح",
    firebaseLoadSuccess: "تم تحميل البيانات",
    firebaseError: "حدث خطأ: {error}",
    firebaseOffline: "أنت غير متصل بالإنترنت",
  },

  en: {
    // Page Title
    title: "MMPI-2 | Dashboard",
    
    // Logo & Header
    logoSubtitle: "Psychological Assessment System",
    
    // Navigation
    home: "Home",
    archive: "Archive",
    back: "Back",
    
    // Welcome Section
    welcomeTitle: "Welcome to the MMPI Test System",
    welcomeMessage: "A professional platform for managing psychological tests. You can create new subject files, manage the archive, and export data with complete ease.",
    newUser: "New User",
    
    // New User Form
    createNewRecord: "Create a New Record",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g., John Doe",
    age: "Age",
    agePlaceholder: "0",
    fileNumber: "File Number",
    fileNumberPlaceholder: "e.g., 2023-A01",
    procedureDate: "Procedure Date",
    gender: "Gender",
    selectGender: "Select Gender...",
    male: "Male",
    female: "Female",
    
    // Action Buttons
    saveAndCreate: "Save and Create",
    archiveAndPreviousUsers: "Archive and Previous Users",
    openFile: "Open File",
    clearSelection: "Clear Selection",
    export: "Export",
    import: "Import",
    copy: "Copy",
    delete: "Delete",
    
    // User List
    selectUsersMessage: "Select users to perform actions",
    noRecords: "No records saved currently",
    
    // Status
    statusNew: "New",
    statusInProgress: "In Progress",
    statusCompleted: "Completed",
    
    // Meta Information
    ageYear: "year",
    file: "File",
    date: "Date",
    
    // Dialogs & Prompts
    enterNewName: "Enter a new name for the copy:",
    confirmDelete: "Are you sure you want to delete {count} item(s)? This action cannot be undone.",
    
    // Toast Messages
    toastSuccess: "File created successfully: {name}",
    toastEnterName: "Please enter the name",
    toastInvalidAge: "Please enter a valid age",
    toastEnterFolder: "Please enter the folder number",
    toastEnterDate: "Please select the date",
    toastEnterGender: "Please select the gender",
    toastUserExists: "A user with the same name already exists",
    toastSelectSingleForOpen: "Please select only one user to open",
    toastSelectUserToExport: "Please select a user to export",
    toastExported: "Selected files have been exported",
    toastImported: "Imported: {count} file(s)",
    toastSkipped: "Skipped {count} file(s) (duplicate or corrupt)",
    toastSelectSingleToCopy: "Please select one user to copy",
    toastNameExists: "Name already exists",
    toastFileNotFound: "Original file not found",
    toastCopied: "{original} has been copied to {newName}",
    toastSelectUserToDelete: "Please select a user to delete",
    toastDeleted: "Successfully deleted",
    
    // Firebase Messages
    firebaseSaveSuccess: "Data saved successfully",
    firebaseLoadSuccess: "Data loaded",
    firebaseError: "An error occurred: {error}",
    firebaseOffline: "You are offline",
  },

  fr: {
    // Page Title
    title: "MMPI-2 | Tableau de bord",
    
    // Logo & Header
    logoSubtitle: "Système d'évaluation psychologique",
    
    // Navigation
    home: "Accueil",
    archive: "Archive",
    back: "Retour",
    
    // Welcome Section
    welcomeTitle: "Bienvenue dans le système de test MMPI",
    welcomeMessage: "Une plateforme professionnelle pour la gestion des tests psychologiques. Vous pouvez créer de nouveaux dossiers de sujets, gérer les archives et exporter des données en toute simplicité.",
    newUser: "Nouvel utilisateur",
    
    // New User Form
    createNewRecord: "Créer un nouvel enregistrement",
    fullName: "Nom complet",
    fullNamePlaceholder: "ex: Jean Dupont",
    age: "Âge",
    agePlaceholder: "0",
    fileNumber: "Numéro de dossier",
    fileNumberPlaceholder: "ex: 2023-A01",
    procedureDate: "Date de la procédure",
    gender: "Genre",
    selectGender: "Sélectionnez le genre...",
    male: "Homme",
    female: "Femme",
    
    // Action Buttons
    saveAndCreate: "Enregistrer et créer",
    archiveAndPreviousUsers: "Archive et utilisateurs précédents",
    openFile: "Ouvrir le dossier",
    clearSelection: "Effacer la sélection",
    export: "Exporter",
    import: "Importer",
    copy: "Copier",
    delete: "Supprimer",
    
    // User List
    selectUsersMessage: "Sélectionnez les utilisateurs pour effectuer des actions",
    noRecords: "Aucun enregistrement sauvegardé pour le moment",
    
    // Status
    statusNew: "Nouveau",
    statusInProgress: "En cours",
    statusCompleted: "Terminé",
    
    // Meta Information
    ageYear: "an",
    file: "Dossier",
    date: "Date",
    
    // Dialogs & Prompts
    enterNewName: "Entrez un nouveau nom pour la copie :",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer {count} élément(s) ? Cette action est irréversible.",
    
    // Toast Messages
    toastSuccess: "Fichier créé avec succès : {name}",
    toastEnterName: "Veuillez entrer le nom",
    toastInvalidAge: "Veuillez entrer un âge valide",
    toastEnterFolder: "Veuillez entrer le numéro de dossier",
    toastEnterDate: "Veuillez sélectionner la date",
    toastEnterGender: "Veuillez sélectionner le genre",
    toastUserExists: "Un utilisateur avec le même nom existe déjà",
    toastSelectSingleForOpen: "Veuillez sélectionner un seul utilisateur à ouvrir",
    toastSelectUserToExport: "Veuillez sélectionner un utilisateur à exporter",
    toastExported: "Les fichiers sélectionnés ont été exportés",
    toastImported: "Importé : {count} fichier(s)",
    toastSkipped: "Ignoré {count} fichier(s) (dupliqué ou corrompu)",
    toastSelectSingleToCopy: "Veuillez sélectionner un seul utilisateur à copier",
    toastNameExists: "Le nom existe déjà",
    toastFileNotFound: "Fichier original non trouvé",
    toastCopied: "{original} a été copié vers {newName}",
    toastSelectUserToDelete: "Veuillez sélectionner un utilisateur à supprimer",
    toastDeleted: "Supprimé avec succès",
    
    // Firebase Messages
    firebaseSaveSuccess: "Données enregistrées avec succès",
    firebaseLoadSuccess: "Données chargées",
    firebaseError: "Une erreur s'est produite : {error}",
    firebaseOffline: "Vous êtes hors ligne",
  }
};

export default translations;
