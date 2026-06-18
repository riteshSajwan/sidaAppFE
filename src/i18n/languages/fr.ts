import { LOCALES } from 'src/i18n/locales';
import { TLocaleId } from 'src/i18n/localesTypes';

const frenchLangTranslations: {
  [key: string]: {
    [idKey in TLocaleId]: string;
  };
} = {
  [LOCALES['French']]: {
    'Admin.Delivery.App.LogIn.Label': 'Se Connecter',
    'Admin.Delivery.App.LogIn.PasswordLabel': 'Saisissez Mot de Passe',
    'Admin.Delivery.App.LogIn.Continue': 'Continuer',
    'Admin.Delivery.App.Profile.Label': 'Profil',
    'Admin.Delivery.App.SearchLabel': 'Recherche',
    'Admin.Delivery.App.Profile.EmailAddress': 'Adresse Mail',
    'Admin.Delivery.App.Profile.Username': 'Nom D`utilisateur',
    'Admin.Delivery.App.Profile.UpdateAccount': 'Mettre à jour le compte',
    'Admin.Delivery.App.Profile.AccountTitle': 'Compte',
    'Admin.Delivery.App.Profile.ChangePassword': 'Changer le mot de passe',
    'Admin.Delivery.App.Restaurants.BusinessLabel': 'Ajouter un nouveau partenaire',
    'Admin.Delivery.App.Restaurants.RestaurantsHeadTitle': 'Liste des Restaurants',
    'Admin.Delivery.App.Restaurants.AddNewTitle': 'Ajouter',
    'Admin.Delivery.App.LoadMore': 'Montrer Plus',
    'Admin.Delivery.App.LogOut.Label': 'Se Deconnecter',
    'Admin.Delivery.App.Restaurants.InfoTitle': 'Informations de base',
    'Admin.Delivery.App.Restaurants.InfoSubtitle': 'Ajoutez des détails de base sur ce partenaire',
    'Admin.Delivery.App.Restaurants.NameLabel': 'Nom du Restaurant',
    'Admin.Delivery.App.Restaurants.OwnerLabel': 'Propriétaire de Restaurant',
    'Admin.Delivery.App.Restaurants.EmailLabel': 'Adresse Mail du Restaurant',
    'Admin.Delivery.App.Restaurants.PhoneLabel': 'Téléphone du Restaurant',
    'Admin.Delivery.App.PhonePlaceholder': 'Entrez le numéro de téléphone',
    'Admin.Delivery.App.Restaurants.NamePlaceHolder': 'Entrez le nom du Restaurant',
    'Admin.Delivery.App.Restaurants.LogoTitle': 'Logo du Restaurant',
    'Admin.Delivery.App.Restaurants.BusinessType': 'Type de partenaire',
    'Admin.Delivery.App.Restaurants.ManagerName': 'Nom gestionnaire',
    'Admin.Delivery.App.Restaurants.ManagerPhone': 'Téléphone du gestionnaire',
    'Admin.Delivery.App.Dashboard.RestaurantManagement': 'Gestion Restaurants',
    'Admin.Delivery.App.Restaurants.ManagerEmail': 'Adresse Mail gestionnaire',
    'Admin.Delivery.App.Restaurants.AddBtnTitle': 'Ajouter un gestionnaire/personnel (facultatif)',
    'Admin.Delivery.App.Restaurants.RemoveBtnTitle': 'Supprimer gestionnaire',
    'Admin.Delivery.App.Restaurants.AddressTitle': 'Adresse',
    'Admin.Delivery.App.Countrylabel': 'Pays',
    'Admin.Delivery.App.Statelabel': 'Etat',
    'Admin.Delivery.App.Addresslabel': 'Adresse',
    'Admin.Delivery.App.Citylabel': 'Ville',
    'Admin.Delivery.App.Postallabel': 'Code Postal',
    'Admin.Delivery.App.PostalPlaceholder': 'Entrer Code Postal',
    'Admin.Delivery.App.ClearBtnTitle': 'Effacer',
    'Admin.Delivery.App.SaveBtnTitle': 'Enregistrer',
    'Admin.Delivery.App.Home': 'Accueil',
    'Admin.Delivery.App.SomethingWentWrong': "Une erreur s'est produite ! Veuillez réessayer.",
    'Admin.Delivery.App.RequestManagementList.Heading': 'Gestion des demandes',
    'Admin.Delivery.App.OnboardingRequest.Services': 'Services fournis',
    'Admin.Delivery.App.OnboardingRequest.Pickup': 'Retrait',
    'Admin.Delivery.App.OnboardingRequest.Delivery': 'Livraison',
    'Admin.Delivery.App.OnboardingRequest.Heading': "Demande d'enrollement",
    'Admin.Delivery.App.OnboardingRequest.RequestDetail': 'Détail de la demande',
    'Admin.Delivery.App.OnboardingRequest.Reject': 'Rejeté',
    'Admin.Delivery.App.OnboardingRequest.Approve': 'Approuvé',
    'Admin.Delivery.App.OnboardingRequest.RequestType.Label': 'Enrollement des restaurants',
    'Admin.Delivery.App.OnboardingRequest.RequestType': 'Type de demande',
    'Admin.Delivery.App.OnboardingRequest.LicenseTitle': 'Licences',
    'Admin.Delivery.App.OnboardingRequest.LicenseNumber': 'Numéro de licence',
    'Admin.Delivery.App.OnboardingRequest.LicenseExpiryDate': "Date d'expiration de la licence",
    'Admin.Delivery.App.OnboardingRequest.LicenseProof': 'Preuve de licence',
    'Admin.Delivery.App.OnboardingRequest.TaxDocumentNumber': 'Numéro de document fiscal',
    'Admin.Delivery.App.OnboardingRequest.TaxProof': 'Preuve fiscale',
    'Admin.Delivery.App.OnboardingRequest.RestaurantTimings': 'Horaires des restaurants',
    'Admin.Delivery.App.OnboardingRequest.OpeningHours': "Heures d'ouverture",
    'Admin.Delivery.App.OnboardingRequest.ClosingHours': 'Heures de fermeture',
    'Admin.Delivery.App.OnboardingRequest.Breakfast': 'Petit Déjeuner',
    'Admin.Delivery.App.OnboardingRequest.Lunch': 'Déjeuner',
    'Admin.Delivery.App.OnboardingRequest.Dinner': 'Dîner',
    'Admin.Delivery.App.OnboardingRequest.ServingFrom': 'Servir à partir de',
    'Admin.Delivery.App.OnboardingRequest.ServingTill': "Servir jusqu'à",
    'Admin.Delivery.App.OnboardingRequest.AvgPrepTime': 'Temps de préparation moyen',
    'Admin.Delivery.App.OnboardingRequest.CategoryLabel': 'Catégorie de restaurant',
    'Admin.Delivery.App.OnboardingRequest.ResImages': 'Images de restaurant',
    'Admin.Delivery.App.RequestManagementList.RestaurantRequests': 'Demandes de restaurants',
    'Admin.Delivery.App.RequestManagementList.DriverRequests': 'Demandes de livreurs',
    'Admin.Delivery.App.RequestManagementList.RequestList': 'Liste des demandes',
    'Admin.Delivery.App.RequestManagementList.Table.ID': 'IDENTIFIANT',
    'Admin.Delivery.App.RequestManagementList.Table.Title': 'Titre',
    'Admin.Delivery.App.RequestManagementList.Table.Name': 'Nom',
    'Admin.Delivery.App.RequestManagementList.Table.Date': 'Date',
    'Admin.Delivery.App.RequestManagementList.Table.Status': 'Statut',
    'Admin.Delivery.App.RequestManagementList.Table.Actions': 'Actions',
    'Admin.Delivery.App.RequestManagementList.Filter': 'Filtre',
    'Admin.Delivery.App.RequestManagementList.Filter.RequestStatus': 'Statut de la demande',
    'Admin.Delivery.App.RequestManagementList.Filter.RequestCreationDate': 'Date de création de la demande',
    'Admin.Delivery.App.RequestManagementList.Filter.All': 'Tout',
    'Admin.Delivery.App.RequestManagementList.Filter.Approved': 'Approuvé',
    'Admin.Delivery.App.RequestManagementList.Filter.Rejected': 'Rejeté',
    'Admin.Delivery.App.RequestManagementList.Filter.Pending': 'En attente',
    'Admin.Delivery.Request.Rejection.Reason.Discrepancy': "Divergence d'information",
    'Admin.Delivery.Request.Rejection.Reason.Documents': 'Documents manquants',
    'Admin.Delivery.Request.Rejection.Reason.Violations': 'Violations des règles',
    'Admin.Delivery.Request.Rejection.Heading': 'Donnez une raison pour rejeter cette demande',
    'Admin.Delivery.Request.Rejection.DescriptionLabel': "Description de l'article",
    'Admin.Delivery.Request.Rejection.DescriptionPlaceHolder': 'Entrer description',
    'Admin.Delivery.App.CancelBtnTitle': 'Annuler',
    'Admin.Delivery.App.Error.DuplicateCountry': 'Pays en double trouvé avec le code ISO du pays donné',
    'Admin.Delivery.App.Select': 'Sélectionner',
    'Admin.Delivery.App.Country.Name': 'Nom du pays',
    'Admin.Delivery.App.Country.Currency': 'Devise',
    'Admin.Delivery.App.Country.DistanceUnit': 'Unité de distance',
    'Admin.Delivery.App.Country.CountryISO': 'Pays ISO',
    'Admin.Delivery.App.Country.CountryISO.Placeholder': 'Code ISO',
    'Admin.Delivery.App.Country.Heading': 'Gestion Pays',
    'Admin.Delivery.App.Snackbar.DataSaved': 'Données enregistrées avec succès',
    'Admin.Delivery.App.Error.DuplicateCity': 'Ville en double trouvée avec le nom de ville donné',
    'Admin.Delivery.App.City.Name': 'Nom de la ville',
    'Admin.Delivery.App.City.Radius': 'Rayon',
    'Admin.Delivery.App.City.TaxName': 'Nom de la taxe',
    'Admin.Delivery.App.City.TaxPercentage': "Pourcentage d'impôt",
    'Admin.Delivery.App.City.Info': 'Informations sur la ville',
    'Admin.Delivery.App.City.Heading': 'Gestion Villes',
    'Admin.Delivery.App.City.TaxInfo': 'Informations fiscales',
    'Admin.Delivery.App.ViewDetails': 'Afficher les détails',
    'Admin.Delivery.App.City.TaxName.Placeholder': 'Entrez le nom de la taxe',
    'Admin.Delivery.App.City.TaxPercentage.Placeholder': 'Entrez le pourcentage de taxe',
    'Admin.Delivery.App.RateTier.Added': 'Prix tarifaire ajouté',
    'Admin.Delivery.App.Filter': 'Filtre',
    'Admin.Delivery.App.Cancel': 'Annuler',
    'Admin.Delivery.App.Save': 'Sauvegarder',
    'Admin.Delivery.App.Restaurants.Reviews': 'Avis',
    'Admin.Delivery.App.Restaurants.ChangePassword': 'Changer le mot de passe',
    'Admin.Delivery.App.Restaurants.OldPassword': 'Ancien mot de passe',
    'Admin.Delivery.App.Restaurants.NewPassword': 'Nouveau mot de passe',
    'Admin.Delivery.App.Restaurants.newPassword': 'Nouveau mot de passe',
    'Admin.Delivery.App.Restaurants.Confirm Password': 'Confirmez le mot de passe',
    'Admin.Delivery.App.Restaurants.confirmNewPassword': 'Confirmer le nouveau mot de passe',
    'Admin.Delivery.App.Submit': 'Soumettre',
    'Admin.Delivery.App.Dashboard.TotalWalletBalance': 'Solde total du portefeuille',
    'Admin.Delivery.App.Wallet.AvailableByCurrency': 'Solde disponible par devise',
    'Admin.Delivery.App.Wallet.AvailableByCurrency.Message': 'Voici les soldes Stripe actuellement disponibles, regroupés par devise.',
    'Admin.Delivery.App.Wallet.AvailableBalance': 'Solde disponible',
    'Admin.Delivery.App.Wallet.NoAvailableBalance': 'Aucun solde disponible trouvé.',
    'Admin.Delivery.App.Dashboard.Cancelled': 'Annulé',
    'Admin.Delivery.App.Dashboard.Delivered': 'Livré',
    'Admin.Delivery.App.Dashboard.Revenue': 'Revenu',
    'Admin.Delivery.App.Dashboard.NoDataAvailableYet': "Aucune donnée disponible pour l'instant",
    'Admin.Delivery.App.Dashboard.Ongoing': 'En cours',
    'Admin.Delivery.App.Dashboard.OngoingOrders': 'Commandes en cours',
    'Admin.Delivery.App.Dashboard.TopPerformers': 'Les plus performants',
    'Admin.Delivery.App.Dashboard.AddNewUser': 'Ajouter un nouvel utilisateur',
    'Admin.Delivery.App.Dashboard.DeliveryPartnerManagement': 'Gestion des partenaires de livraison',
    'Admin.Delivery.App.Dashboard.UserManagement': 'Gestion des utilisateurs',
    'Admin.Delivery.App.Country.CountryManager': 'Gestion Pays',
    'Admin.Delivery.App.Country.ServiceArea&FeeConfiguration': 'Pays',
    'Admin.Delivery.App.Country.AddNewCountry': 'Ajouter un nouveau pays',
    'Admin.Delivery.App.Country.Name.required': '*Le nom du pays est obligatoire',
    'Admin.Delivery.App.Country.Distance.Unit': "*L'unité de distance est requise",
    'Admin.Delivery.App.Country.Iso.Code': '*Le code ISO du pays est requis',
    'Admin.Delivery.App.Country.Currency.Required': '*La devise est requise',
    'Admin.Delivery.Restaurant.Address.Required': "*L'adresse est obligatoire",
    'Admin.Delivery.Restaurant.Country.Required': '*le pays est obligatoire',
    'Admin.Delivery.City.Name.Required': '*Le nom de la ville est obligatoire',
    'Admin.Delivery.App.Country.Radius.Numberic': 'Le rayon doit être numérique',
    'Admin.Delivery.App.Country.Radius.Positive.Number': 'Le rayon doit être un nombre positif',
    'Admin.Delivery.App.Country.Tax.Required': '*Le nom fiscal est obligatoire',
    'Admin.Delivery.App.Country.Tax.Percentage.Required': '*Le pourcentage de taxe est requis',
    'Admin.Delivery.App.Country.Valid.Percentage': "Saisissez un pourcentage valide compris entre 0 et 100 avec jusqu'à deux décimales",
    'Admin.Delivery.Add.City': 'Ajouter une nouvelle ville',
    'Admin.Delivery.App.City.Master': 'Gestion Villes',
    'Admin.Delivery.App.LogIn.UserEmail': "Entrez le nom d'utilisateur ou l'adresse e-mail",
    'Admin.Delivery.App.Restaurant.Review.Title': 'Détails du restaurant',
    'Admin.Delivery.App.Restaurant.Logo.Image': 'Logo/image du restaurant',
    'Admin.Delivery.App.Restaurant.Licence.Document': 'Licences et documents',
    'Admin.Delivery.App.Restaurant.Tax.Document': 'Preuve de document fiscal',
    'Admin.Delivery.App.Restaurant.Upload.Images': "Télécharger une image jusqu'à 10 Mo",
    'Admin.Delivery.App.Restaurant.Basic.Details.Business': 'Ajoutez des détails de base sur ce partenaire',
    'Admin.Delivery.App.Restaurant.Restaurant.serve': 'Quel type de nourriture ce restaurant sert-il ?',
    'Admin.Delivery.App.Next': 'Suivant',
    'Admin.Delivery.App.City.Max.Distance': 'Distance maximale',
    'Admin.Delivery.App.UserManagementList.ManagementList': 'Gestion de liste',
    'Admin.Delivery.App.UserManagementList.Heading': 'Gestion des utilisateurs',
    'Admin.Delivery.App.Customer.Customer.Name': 'Nom du client',
    'Admin.Delivery.App.Customer.Profile.Name': 'Image de profil',
    'Admin.Delivery.App.Customer.Email': 'Adresse Mail',
    'Admin.Delivery.App.Customer.Phone.Number': 'Numéro de téléphone',
    'Admin.Delivery.App.Customer.Registeration.Date': "Date d'inscription",
    'Admin.Delivery.App.Customer.Detail': 'Détail du client',
    'Admin.Delivery.App.UserManagementList.Filter.Registration.Date': "Date d'inscription",
    'Admin.Delivery.App.UserManagementList.Filter.Active': 'Actif',
    'Admin.Delivery.App.UserManagementList.Filter.Inactive': 'Inactif',
    'Admin.Delivery.App.UserManagementList.Filter.Block': 'Bloqué',
    'Admin.Delivery.App.Restaurants.NoRestaurantFound': 'Aucun restaurant trouvé',
    'Admin.Delivery.App.Customer.Table.Phone.Number': 'Numéro de téléphone',
    'Admin.Delivery.App.Customer.Table.Customer.Name': 'Nom du client',
    'Admin.Delivery.App.Customer.Table.Profile.Image': 'Image de profil',
    'Admin.Delivery.App.Yes': 'Oui',
    'Admin.Delivery.App.Upload.Picture': 'Appuyez pour télécharger',
    'Admin.Delivery.App.File.Format': "Téléchargez des fichiers au format PDF DOCX ou JPEG jusqu'à 10 Mo chacun",
    'Admin.Delivery.App.Verified.Business': 'Cette partenaire est-il vérifié ?',
    'Admin.Delivery.App.Closing.Time': "Sélectionnez l'heure de fermeture",
    'Admin.Delivery.App.Business.Operate': 'Quand ce partenaire opère-t-il ?',
    'Admin.Delivery.App.Opening.Time': "Sélectionnez l'heure d'ouverture",
    'Admin.Delivery.App.Revenue.Share': 'Partage des revenus',
    'Admin.Delivery.App.Enter.Percentage': 'Entrez le pourcentage %',
    'Admin.Delivery.App.States': 'États',
    'Admin.Delivery.App.Cities': 'Villes',
    'Admin.Delivery.App.Regional.Name': 'Nom de la Region',
    'Admin.Delivery.App.Enter.Name': 'Entrer Nom',
    'Admin.Delivery.App.Center.Location': 'Emplacement du centre',
    'Admin.Delivery.App.Region.Definition': 'Définition de la région',
    'Admin.Delivery.App.Area.Serviceable.Areas': 'Zones desservies',
    'Admin.Delivery.App.Area.Area.Definitions': 'Définition de la zone de service',
    'Admin.Delivery.App.Add.New.Area': 'Ajouter une nouvelle zone',
    'Admin.Delivery.Custom.DatePicker.MustBeHigherThan': 'Doit être supérieur à {{date}}',
    'Admin.Delivery.App.Driver.Detail': 'Détails du livreur',
    'Admin.Delivery.App.Customer.Driver.Name': 'Nom du livreur',
    'Admin.Delivery.App.Wallet': 'Portefeuille',
    'Admin.Delivery.App.AvailableBalance': 'Toutes transactions',
    'Admin.Delivery.App.TransactionHistory': 'Historique des transactions',
    'Admin.Delivery.App.All.TransactionHistory': 'Toutes transactions',
    'Admin.Delivery.App.Refunds': 'Remboursements',
    'Admin.Delivery.App.Debits': 'Débits',
    'Admin.Delivery.App.CreditDebit': 'Crédits débités',
    'Admin.Delivery.App.CreditRefunded': 'Crédits remboursés',
    'Admin.Delivery.App.Driver.Vehicle.Type': 'Type de véhicule',
    'Admin.Delivery.App.UserManagementList.Filter.Unblock': 'Débloqué',
    'Admin.Delivery.App.Block.Reason': 'Donnez une raison pour bloquer ce client',
    'Admin.Delivery.App.RequestManagementList.Table.Blocked.Reason': 'Raison du blocage',
    'Admin.Delivery.App.Driver.Account.Number': 'Numéro de compte',
    'Admin.Delivery.App.Driver.Payment.Method': 'Mode de Paiement',
    'Admin.Delivery.App.Driver.ifscCode': 'Code IFSC',
    'Admin.Delivery.App.Driver.Dob': 'Dob',
    'Admin.Delivery.App.Driver.Full.Name': 'Nom et prénom',
    'Admin.Delivery.App.Driver.Relationship': 'Lien',
    'Admin.Delivery.App.Driver.Emergency.Details': "Détails d'urgence",
    'Admin.Delivery.App.Restaurant.Licence.Number': 'Numéro de licence',
    'Admin.Delivery.App.Restaurant.Expiry.Date': "date d'expiration",
    'Admin.Delivery.App.Restaurant.Created.By': 'Créé par',
    'Admin.Delivery.App.Restaurant.Created.At': 'Créé à',
    'Admin.Delivery.App.Search.Restaurant': 'Rechercher des restaurants',
    'Admin.Delivery.App.Restaurant': 'Restaurant',
    'Admin.Delivery.App.Driver': 'Livreur',
    'Admin.Delivery.App.Customer': 'Client',
    'Admin.Delivery.App.Restaurant.Wallets': 'Portefeuilles des restaurants',
    'Admin.Delivery.App.Driver.No.Data.Found': 'Aucune donnée trouvée',
    'Admin.Delivery.App.Restaurant.Image.Type': 'Types de fichiers autorisés : PNG JPG JPEG WEBP',
    'Admin.Delivery.App.DriverManagement.Heading': 'Gestion des livreurs',
    'Admin.Delivery.App.Custom.Rates': 'Tarifs personnalisés',
    'Admin.Delivery.App.Rates': 'Tarifs',
    'Admin.Delivery.App.To': 'À',
    'Admin.Delivery.App.Add.RateTier': 'Niveaux de taux',
    'Admin.Delivery.App.City.List': 'Liste des villes',
    'Admin.Delivery.App.Configure.Service': 'Configurer la région de service',
    'Admin.Delivery.App.Select.Language': 'Veuillez sélectionner un pays et une langue',
    'Admin.Delivery.App.Apply': 'Appliquer',
    'Admin.Delivery.App.Default.Rates': 'Tarifs par défaut',
    'Admin.Delivery.App.Restaurants.CurrentPassword': 'Mot de passe actuel',
    'Admin.Delivery.App.Tax.Rates': "Taux d'imposition",
    'Admin.Delivery.App.Customer.Wallets': 'Portefeuilles Clients',
    'Admin.Delivery.App.Driver.Wallets': 'Portefeuilles Livreurs',
    'Admin.Delivery.App.Driver.Wallets.Refunded': 'Remboursé',
    'Admin.Delivery.App.Driver.Wallets.Debited': 'Débité',
    'Admin.Delivery.App.Meal.Validation': "Les heures d'ouverture et de fermeture des repas doivent être comprises dans les heures d'ouverture du restaurant.",
    'Admin.Delivery.App.Image.Validation': 'Type de fichier non valide : Formats autorisés ( image/jpg image/png image/jpeg',
    'Admin.Delivery.App.PhoneNo': 'Numéro de téléphone',
    'Admin.Delivery.App.DateOfBirth': 'Date de naissance',
    'Admin.Delivery.App.AssignedCountry': 'Pays Assigné',
    'Admin.Delivery.App.AssignedCity': 'Ville Assignée',
    'Admin.Delivery.App.VehicleType': 'Type de véhicule de livraison',
    'Admin.Delivery.App.EmergencyInfo': "Contacts d'urgence",
    'Admin.Delivery.App.ItemCategory': "Catégorie d'article",
    'Admin.Delivery.App.Residential.Address': 'Adresse résidentielle',
    'Admin.Delivery.App.DriverLicenseNo': 'Numéro de permis de conduire',
    'Admin.Delivery.App.Registration_Vehicle': "Numéro d'immatriculation du véhicule",
    'Admin.Delivery.App.RegistrationPapers': "Documents d'inscription",
    'Admin.Delivery.App.VehicleInsuranceNo': "Numéro d'assurance du véhicule",
    'Admin.Delivery.App.InsuranceDocument': "Document d'assurance",
    'Admin.Delivery.App.BankDetails': 'Coordonnées bancaires',
    'Admin.Delivery.App.PaymentMethod': 'Mode de paiement préféré',
    'Admin.Delivery.App.BankAccountNo': 'Numéro de compte bancaire',
    'Admin.Delivery.App.DuplicateEmail': "Il existe un adresse mail d'utilisateur en double",
    'Admin.Delivery.App.DuplicatePhoneNo': "Il existe un numéro de téléphone d'utilisateur en double",
    'Admin.Delivery.App.DuplicateUser': "Il existe un nom d'utilisateur en double",
    'Admin.Delivery.App.AddRateTier': 'Ajouter un niveau de tarif',
    'Admin.Delivery.App.Licence.Validation': 'Type de fichier non valide. Formats de fichiers autorisés : JPEG PNG GIF PDF DOC XLS',
    'Admin.Delivery.App.Customer.Error.MaxLength': 'Limite dépassée : {{blockreasonLimit}} caractère',
    'Admin.Delivery.App.Customer.Error.Mandatory.Field': 'Champ obligatoire',
    'Admin.Delivery.App.Customer.Error.Character.Limit.Field': 'Limite de caractères : {{characterLimit}}',
    'Admin.Delivery.App.Customer.Error.Image.Size.Limit.Field': "La taille de l'image ne peut pas dépasser {{Size}} Mo",
    'Admin.Delivery.App.Driver.License.Details': 'Détails de la licence',
    'Admin.Delivery.App.Driver.License.Registration.Number': "Numéro d'enregistrement",
    'Admin.Delivery.App.Driver.Bank.Details': 'Coordonnées bancaires',
    'Admin.Delivery.App.Driver.Vehicle.Insurance.Details': "Détails de l'assurance automobile",
    'Admin.Delivery.App.Driver.Vehicle.Insurance.Number': "Numéro d'assurance du véhicule",
    'Admin.Delivery.App.Driver.Block.Reason': 'Donnez une raison pour bloquer ce pilote',
    'Admin.Delivery.App.Example': 'Par exemple {{type}}',
    'Admin.Delivery.App.Custom': 'Personnalisé',
    'Admin.Delivery.App.CustomRate': 'Tarif personnalisé',
    'Admin.Delivery.App.Rider.Earnings': 'Gains du Chauffeur',
    'Admin.Delivery.App.Enter.Rider.Earnings': 'Saisissez les gains du chauffeur',
    'Admin.Delivery.App.Country.RiderShare.Positive.Number': 'La part du chauffeur doit être un nombre positif',
    'Admin.Delivery.App.Country.Service.Fee': 'Frais de service',
    'Admin.Delivery.App.Enter.Service.Fee': 'Entrez les frais de service',
    'Admin.Delivery.App.Country.Minimum.Service.Fee': 'Frais de service minimum',
    'Admin.Delivery.App.Enter.Minimum.Service.Fee': 'Entrez les frais de service minimum',
    'Admin.Delivery.App.Country.Tip.Numeric': '*Le pourboire doit être numérique',
    'Admin.Delivery.App.Country.MinimumServiceFee.Numeric': "*Les frais de service minimum doivent être numériques avec jusqu'à deux décimales",
    'Admin.Delivery.App.Expiry.Date.Validation': "La date d'expiration de la licence doit être supérieure à la date actuelle",
    'Admin.Delivery.App.Rate.Tiers': 'Tarifs',
    'Admin.Delivery.App.Countries': 'Pays',
    'Admin.Delivery.App.Name.required': '*Le nom est requis',
    'Admin.Delivery.App.Phone.No.required': '*Le numéro de téléphone est requis',
    'Admin.Delivery.App.Invalid.Phone.No': 'Numéro de téléphone invalide',
    'Admin.Delivery.App.Email.required': "*L'adresse mail est obligatoire",
    'Admin.Delivery.App.Invalid.Email': 'Adresse Mail invalide',
    'Admin.Delivery.App.Business.Required': '*Le type de partenaire est obligatoire',
    'Admin.Delivery.App.Character.Exceed': 'La limite de caractères est dépassée',
    'Admin.Delivery.App.Share.Percentage': '*Le pourcentage de partage est requis',
    'Admin.Delivery.App.Restaurant.Share': 'Part de Wassa Wassa',
    'Admin.Delivery.App.Driver.List': 'Liste des Livreurs',
    'Admin.Delivery.App.Customer.Management': 'Gestion des clients',
    'Admin.Delivery.App.Customer.List': 'Liste des clients',
    'Admin.Delivery.App.Block': 'Bloquer',
    'Admin.Delivery.App.Unblock': 'Débloquer',
    'Admin.Delivery.App.Customer.Subscription.Expiry.Date': "Date d'expiration de l'abonnement",
    'Admin.Delivery.App.Upload.Multiple.Items.Size': 'La taille totale du fichier ne doit pas dépasser {{size}} Mo',
    'Admin.Delivery.App.Upload.Item.Size': 'La taille maximale du fichier autorisée est de {{size}} Mo',
    'Admin.Delivery.App.InvoicesOverdue': 'Factures impayées',
    'Admin.Delivery.App.Riders.Earnings': 'Part des gains du livreur',
    'Admin.Delivery.App.Licence.Validations': 'Type de fichier non valide. Formats de fichiers autorisés :  JPEG, PNG, JPG, PDF, DOCX',
    'Admin.Delivery.App.Format': "Téléchargez des fichiers au format PDF, PNG, DOCX, JPG ou JPEG, jusqu'à 10 Mo chacun",
    'Admin.Delivery.App.Restaurants': 'Restaurants',
    'Admin.Delivery.App.View.All': 'Afficher Tout',
    'Admin.Delivery.App.Search.Address': 'Rechercher une adresse',
    'Admin.Delivery.App.Select.Country': 'Sélectionnez un pays',
    'Admin.Delivery.App.Country.Tip': 'Pourboire minimum (facultatif)',
    'Admin.Delivery.App.Country.Tip.Placeholder': 'Entrez le pourboire',
    'Admin.Delivery.App.Order.Detail': 'Détails de la commande',
    'Admin.Delivery.App.Your.Order': 'Votre commande',
    'Admin.Delivery.App.Item.Total': "Total de l'article",
    'Admin.Delivery.App.Sub.Total': 'Sous-total',
    'Admin.Delivery.App.Service.Fee': 'Frais de service',
    'Admin.Delivery.App.Delivery.Fee': 'Frais de livraison',
    'Admin.Delivery.App.Total.Amount': 'Montant total',
    'Admin.Delivery.App.Order.Number': 'Numéro de commande',
    'Admin.Delivery.App.Delivered.To': 'Livré à',
    'Admin.Delivery.App.Mins.Remaining': 'Minutes restantes',
    'Admin.Delivery.App.Order': 'Commande',
    'Admin.Delivery.App.OrderManagement.Heading': 'Gestion des commandes',
    'Admin.Delivery.App.Orders': 'Commandes',
    'Admin.Delivery.App.Orders.Table.Name': 'Nom du restaurant',
    'Admin.Delivery.App.Orders.Table.Image': 'Logo du restaurant',
    'Admin.Delivery.App.Orders.Table.OrderId': 'ID de commande',
    'Admin.Delivery.App.Tags': 'Mots clés',
    'Admin.Delivery.App.Tags.TagsManager': 'Gestion des Tags',
    'Admin.Delivery.App.Tags.Tags': 'Tags',
    'Admin.Delivery.App.Tags.Creation.Date': 'Date de création',
    'Admin.Delivery.App.Country.AddNewTag': 'Ajouter une nouvelle Tag',
    'Admin.Delivery.App.Tag.Name': 'nom Tag',
    'Admin.Delivery.App.Tag.Name.required': '*Le nom de la Tag est obligatoire',
    'Admin.Delivery.App.Tag.Duplicate.Validation': "Il existe une étiquette d'entreprise en double",
    'Admin.Delivery.App.Select.City': 'Sélectionnez la ville',
    'Admin.Delivery.App.OrderList.Filter.PREPARATION': 'Préparation',
    'Admin.Delivery.App.OrderList.Filter.OUT_FOR_DELIVERY': 'En Chemin',
    'Admin.Delivery.App.OrderList.Filter.READY_FOR_PICKUP': 'Prêt à être récupéré',
    'Admin.Delivery.App.OrderList.Filter.OPEN': 'Ouvert',
    'Admin.Delivery.App.OrderList.Filter.REJECTED': 'Rejeté',
    'Admin.Delivery.App.OrderList.Filter.SCHEDULED': 'Programmé',
    'Admin.Delivery.App.OrderList.Filter.PICKED_UP': 'Récupéré',
    'Admin.Delivery.App.OrderList.Filter.DELIVERED': 'Livrée',
    'Admin.Delivery.App.OrderList.Filter.CONFIRMED': 'Confirmée',
    'Admin.Delivery.App.Coupon': 'Coupons',
    'Admin.Delivery.App.CouponManagement.Heading': 'Gestion des coupons',
    'Admin.Delivery.App.Coupon.List': 'Liste des coupons',
    'Admin.Delivery.App.AddNewCoupon': 'Ajouter un nouveau coupon',
    'Admin.Delivery.App.Coupon.CouponManager': 'Détails du coupon',
    'Admin.Delivery.App.Coupon.Name': 'Code promo',
    'Admin.Delivery.App.Coupon.Name.required': '*Le nom du coupon est obligatoire',
    'Admin.Delivery.App.Coupon.Expiry.Date': "Date d'expiration du coupon",
    'Admin.Delivery.App.Coupon.Amount.required': '*Le montant minimum du coupon est requis',
    'Admin.Delivery.App.Expiry.Date.required': "*La date d'expiration est requise",
    'Admin.Delivery.App.Coupon.Amount': 'Montant minimum du coupon',
    'Admin.Delivery.App.Enter.Amount': 'Entrez le montant minimum',
    'Admin.Delivery.App.Coupon.Table.CouponId': 'ID du coupon',
    'Admin.Delivery.App.Coupon.value.Percentage': 'Valeur du coupon en %',
    'Admin.Delivery.App.Enter.Coupon.value.Percentage': 'Entrez la valeur du coupon en %',
    'Admin.Delivery.App.Coupan.value.required': '*La valeur du coupon est requise',
    'Admin.Delivery.App.Order.List': 'Liste de commandes',
    'Admin.Delivery.App.Driver.AccountHolderName': 'Nom du titulaire du compte',
    'Admin.Delivery.App.Driver.RibNumber': 'Numéro RIB',
    'Admin.Delivery.App.Driver.MobileNumber': 'Numéro de portable',
    'Admin.Delivery.App.Driver.BankTransfer': 'Virement bancaire',
    'Admin.Delivery.App.Driver.Wave': 'Wave',
    'Admin.Delivery.App.Default': 'Défaut',
    'Admin.Delivery.App.Email.Required': "*L'adresse e-mail est obligatoire!",
    'Admin.Delivery.App.Password.Required': '*Le mot de passe est requis!',
    'Admin.Delivery.App.Invalids.Email': '*Adresse e-mail invalide !',
    'Admin.Delivery.App.Licenses.Documents': 'Licences et documents',
    'Admin.Delivery.App.Date.Required': 'La date est obligatoire',
    'Admin.Delivery.App.Image.Required': "L'image est requise",
    'Admin.Delivery.App.Document.Required': 'Le document est requis',
    'Admin.Delivery.App.End.Range.Required': '*La plage de fin est requise.',
    'Admin.Delivery.App.Greater.Than.Start.Range': 'La plage de fin doit être supérieure à la plage de début.',
    'Admin.Delivery.App.End.Range.valid.Number': 'La plage de fin doit être un nombre valide',
    'Admin.Delivery.App.Cost.Per.Required': '*Le coût par unité est obligatoire',
    'Admin.Delivery.App.Cost.Positive.Number': 'Le coût doit être un nombre positif.',
    'Admin.Delivery.App.Cost.Numeric': 'Le coût par unité doit être numérique',
    'Admin.Delivery.App.Cost.Must.Be.Positive': 'Le coût par unité doit être un nombre positif',
    'Admin.Delivery.App.Ticket': 'Tickets',
    'Admin.Delivery.App.TicketManagement.Heading': 'Gestion des tickets',
    'Admin.Delivery.App.Ticket.List': 'Liste des tickets',
    'Admin.Delivery.App.Ticket.Table.TicketId': 'ID du ticket',
    'Admin.Delivery.App.Ticket.Table.TicketStatus': 'Statut du ticket',
    'Admin.Delivery.App.Ticket.Table.TicketIssueType': "Type d'émission de ticket",
    'Admin.Delivery.App.Ticket.Detail': 'Détails du ticket',
    'Admin.Delivery.App.Ticket.Table.Description': 'Description',
    'Admin.Delivery.App.Ticket.Table.ChangeTicketStatus': 'Modifier le statut du ticket',
    'Admin.Delivery.App.OrderList.Filter.Close': 'Fermer',
    'Admin.Delivery.Request.Rejection.CommentPlaceHolder': 'Entrez un commentaire',
    'Admin.Delivery.App.Ticket.Table.Comment': 'Commentaire',
    'Admin.Delivery.App.Ticket.Issue.Image': 'Image du problème',
    'Admin.Delivery.App.Restaurant.List': 'Liste des restaurants',
    'Admin.Delivery.App.Drivers.Working.List': "Les conducteurs travaillant aujourd'hui",
    'Admin.Delivery.App.Support.Requests': "Demandes d'assistance",
    'Admin.Delivery.App.New Customer': 'Nouveaux clients',
    'Admin.Delivery.App.Notifications': 'Notifications',
    'Admin.Delivery.App.Banner': 'Bannières',
    'Admin.Delivery.App.BannerManagement.Heading': 'Gestion des bannières',
    'Admin.Delivery.App.Banner.List': 'Liste des bannières',
    'Admin.Delivery.App.Banner.Table.Image': 'Image de bannière',
    'Admin.Delivery.App.Banner.Table.BannerId': 'ID de la bannière',
    'Admin.Delivery.App.Banner.BannerManager': 'Gestion des bannières',
    'Admin.Delivery.App.Banner.Name': 'Nom de la bannière',
    'Admin.Delivery.App.Banner.Expiry.Date': "Date d'expiration de la bannière",
    'Admin.Delivery.App.Banner.Restauarant.Name': 'Sélectionnez un restaurant',
    'Admin.Delivery.App.Banner.Image.required': "*L'image de la bannière est obligatoire",
    'Admin.Delivery.App.Banner.Name.required': '*Le nom de la bannière est obligatoire',
    'Admin.Delivery.App.Restaurant.required': '*Le restaurant est obligatoire',
    'Admin.Delivery.App.Tag.ID': 'ID de la Tag',
    'Admin.Delivery.App.OrderList.Filter.All': 'Tout',
    'Admin.Delivery.App.Ticket.DataSaved': 'Statut du ticket mis à jour',
    'Admin.Delivery.App.Coupon.Maximum.Amount': 'Montant maximum du coupon',
    'Admin.Delivery.App.Coupon.Placeholder.Maximum.Amount': 'Entrez le montant maximum',
    'Admin.Delivery.App.Coupon.Maximum.Amount.required': '*Le montant maximum du coupon est requis',
    'Admin.Delivery.App.Drivers': 'Livreurs',
    'Admin.Delivery.App.Minimum.Offer.To.Avail': 'Montant minimum à dépenser pour bénéficier de cette offre',
    'Admin.Delivery.App.Add.Coupon': 'Ajouter un coupon',
    'Admin.Delivery.App.Expiry.Date': "Date d'expiration",
    'Admin.Delivery.App.Create.New.Tag': 'Créer une nouvelle Tag',
    'Admin.Delivery.App.Customers': 'Clients',
    'Admin.Delivery.App.Restaurant.Created.AT': 'Créé à',
    'Admin.Delivery.App.TicketStatus': 'Statut du ticket',
    'Admin.Delivery.App.Coupon.couponName.required': 'Le nom du coupon est obligatoire',
    'Admin.Delivery.App.Edit.Restaurant': 'Modifier le restaurant',
    'Admin.Delivery.App.Coupon.Minimum.Amount.required': '*Le montant minimum du coupon est requis',
    'Admin.Delivery.App.Restaurant.Order.Date': 'Date de commande',
    'Admin.Delivery.Restaurant.City.Required': '*La ville est obligatoire',
    'Admin.Delivery.App.OrderList.Filter.CANCELLED': 'Annulée',
    'Admin.Delivery.App.Delivering.To': 'Livrer à',
    'Admin.Delivery.App.Special.Request': 'Demande spéciale',
    'Admin.Delivery.App.Delivery.Note': 'Instructions de livraison',
    'Admin.Delivery.App.Pickup.By': 'Récupérer',
    'Admin.Delivery.App.Tip': 'Pourboire',
    'Admin.Delivery.App.Dashboard.All.Orders': 'Toutes les commandes',
    'Admin.Delivery.App.Banner.BannerDetail': 'Détail de la bannière',
    'Admin.Delivery.App.Calendar.Select.Year': "Sélectionnez l'année",
    'Admin.Delivery.App.Banner.Add.Banner': 'Ajouter une bannière',
    'Admin.Delivery.App.Add.Ticket': 'Ajouter un ticket',
    'Admin.Delivery.App.Add.Tags': 'Ajouter une tag',
    'Admin.Delivery.App.French.Name.required': '*Le nom français est obligatoire',
    'Admin.Delivery.App.French.Name': 'Nom français',
    'Admin.Delivery.App.Rejected.Reason': 'Motif du rejet',
    'Admin.Delivery.App.Restaurant.Name': 'Nom du restaurant',
    'Admin.Delivery.App.Restaurant.Insurance.Proof': "Preuve d'assurance",
    'Admin.Delivery.App.Restaurant.Vehicle.Proff': 'Preuve du véhicule',
    'Admin.Delivery.App.Deleted': 'Supprimé',
    'Admin.Delivery.App.Account.Status': 'Statut du compte',
    'Admin.Delivery.App.Wallet.Balance': 'Solde Portefeuille',
    'Admin.Delivery.App.Restaurant.Wallet': 'Portefeuille Restaurant',
    'Admin.Delivery.App.Driver.Wallet': 'Portefeuille Livreur',
    'Admin.Delivery.App.Driver.Wallets.Credited': 'Crédité',
    'Admin.Delivery.App.Driver.No.Transaction.Available': 'Aucune transaction disponible',
    'Admin.Delivery.Restaurant.Country.Is.Required': '*Le pays est obligatoire',
    'Admin.Delivery.App.Country.Valid.Percentage.Up.To': "Saisissez un pourcentage valide compris entre 0 et 100 avec jusqu'à deux décimales",
    'Admin.Delivery.App.Driver.Minimum.Order.Amount': 'Montant minimum de commande',
    'Admin.Delivery.App.Driver.Maximum.Discount.Amount': 'Montant maximal de la remise',
    'Admin.Delivery.App.Coupon.Minimum.Order.Amount.required': '*Un montant minimum de commande est requis',
    'Admin.Delivery.App.Coupon.Minimum.Discount.Amount.required': '*Le montant maximum de remise est requis',
    'Admin.Delivery.App.Coupon.Discount': 'Coupon de réduction',
    'Admin.Delivery.App.View.Details': 'Voir les détails',
    'Admin.Delivery.App.Customer.ID': 'ID client',
    'Admin.Delivery.App.Coupon.couponCode.required': '*Le code promo est requis',
    'Admin.Delivery.App.Reported.To': 'Signalé à',
    'Admin.Delivery.App.Reported.From': 'apporté par',
    'Admin.Delivery.App.Other': 'Autre',
    'Admin.Delivery.App.seller.review': 'Avis sur le vendeur',
    'Admin.Delivery.App.rider.review': 'Avis sur le livreur',
    'Admin.Delivery.App.rider.rating': 'Évaluation du livreur',
    'Admin.Delivery.App.seller.rating': 'Évaluation du vendeur',
    'Admin.Delivery.App.Delivery.Phone.Number': 'Numéro de téléphone du destinataire',
    'Admin.Delivery.App.Email.SameError': "L'addresse mail du gestionnaire et du propriétaire ne peut pas être le même",
    'Admin.Delivery.App.Phone.No.SameError': 'Le numéro de téléphone du gestionnaire et du propriétaire ne peut pas être le même',
    'Admin.Delivery.App.Country.Valid.To.Percentage': 'Entrez un pourcentage valide entre 0 et 100',
    'Admin.Delivery.App.Country.Code': 'Code du pays',
    'Admin.Delivery.App.Authentication.Failed': "Échec de l'authentification ! Le nom d'utilisateur ou le mot de passe est incorrect !",
    'Admin.Delivery.App.Coupon.Status': 'Statut du coupon',
    'Admin.Delivery.App.Banner.Status': 'Statut de la bannière',
    'Admin.Delivery.App.Payment.Method': 'Mode de paiement',
    'Admin.Delivery.App.PaymentMethod.required': '*Le mode de paiement est requis',
    'Admin.Delivery.App.Blocked.Many.Attempts': 'Votre compte peut être bloqué après trop de tentatives',
    'Admin.Delivery.App.Valid.Percentage.No.Decimal': 'Les valeurs décimales ne sont pas autorisées',
    'Admin.Delivery.App.Country.MinimumServiceFee.Numeric.No.Decimal': '*Les frais de service minimum doivent être numériques',
    'Admin.Delivery.App.Wallet.Credit.Amount': 'Montant du crédit',
    'Admin.Delivery.App.Wallet.Transaction.Type': 'Type de transaction',
    'Admin.Delivery.App.Wallet.Transaction.Type.CREDITED': 'CRÉDITÉ',
    'Admin.Delivery.App.Wallet.Transaction.Type.DEBITED': 'DÉBITÉ',
    'Admin.Delivery.App.Wallet.Transaction.Type.ALL': 'TOUT',
    'Admin.Delivery.App.Average.Preparation.Minutes': '{{minutes}} minutes',
    'Admin.Delivery.App.Average.Serving.From': 'Servi à partir de',
    'Admin.Delivery.App.Average.Serving.Till': "Servir jusqu'à",
    'Admin.Delivery.App.Average.From.Time': 'A partir de',
    'Admin.Delivery.App.Average.Till.Time': "Jusqu'à",
    'Admin.Delivery.App.Orders.Table.RequestId': 'ID de la demande',
    'Admin.Delivery.App.Select.Month.Range': 'Sélectionnez la plage de mois',
    'Admin.Delivery.App.Select.Start.Month.Year.placeholder': "Sélectionnez le mois et l'année de début",
    'Admin.Delivery.App.Select.End.Month.Year.placeholder': 'Sélectionnez le mois-année de fin',
    'Admin.Delivery.App.Select.Start.Month.Year': 'Mois-année de début',
    'Admin.Delivery.App.Select.End.Month.Year': 'Fin mois-année',
    'Admin.Delivery.App.Select.Start.Date': "Sélectionnez d'abord la date de début",
    'Admin.Delivery.App.Select.Date.Range': 'Sélectionnez la plage de dates (12 mois maximum)',
    'Admin.Delivery.App.Reports': 'Rapports',
    'Admin.Delivery.App.Downoload.Reports': 'Télécharger les rapports',
    'Admin.Delivery.App.Sale': 'Vente',
    'Admin.Delivery.App.New.Drivers': 'Nouveaux Conducteurs',
    'Admin.Delivery.App.New.Restaurant': 'NouveauRestaurant',
    'Admin.Delivery.App.Sales': 'Ventes',
    'Admin.Delivery.App.Profit': 'Profit',
    'Admin.Delivery.App.No.Support': "Personne n'est disponible pour vous aider !",
    'Admin.Delivery.App.Date.Today': "Aujourd'hui",
    'Admin.Delivery.App.Chat.Error': 'Impossible de se connecter. Veuillez réessayer !',
    'Admin.Delivery.App.Type.Your.Message': 'Tapez votre message...',
    'Admin.Delivery.App.Tax.Amount': 'Incluant taxe de',
    'Admin.Delivery.App.Admin': 'Administrateur',
    'Admin.Delivery.App.Download.Invoice': 'Télécharger la facture',
    'Admin.Delivery.Ticket.Refund': 'Remboursement',
    'Admin.Delivery.Ticket.Payment.Issues': 'Problème de paiement',
    'Admin.Delivery.App.Fake.Discounts': 'Cacher les vrais prix ou utiliser de fausses réductions',
    'Admin.Delivery.App.Low.Quality.Food': 'Livrer de la nourriture de qualité inférieure à celle annoncée',
    'Admin.Delivery.App.Less.Food': 'Servir moins de nourriture que commandée',
    'Admin.Delivery.App.Charging.Not.Delivering': 'Facturer des articles mais ne pas les livrer',
    'Admin.Delivery.App.Manipulate.Timings': 'Retarder le statut de la commande pour manipuler les délais',
    'Admin.Delivery.App.Rider.Claim': "Le Livreur signale la livraison sans l'avoir effectuée",
    'Admin.Delivery.App.Fake.Rating': 'Le livreur crée de fausses notes pour obtenir plus de pourboires',
    'Admin.Delivery.App.Fake.Delivery': 'Le livreur prend la commande au lieu de la livrer',
    'Admin.Delivery.App.Fake.Reason': 'Le livreur simule des retards ou des annulations pour obtenir un salaire supplémentaire',
    'Admin.Delivery.App.Falsifies.Location': 'Un livreur falsifie sa localisation pour gonfler les délais de livraison',
    'Admin.Delivery.App.Yes.Label': 'Oui',
    'Admin.Delivery.App.No.Label': 'Non',
    'Admin.Delivery.App.Payment.Success': 'Paiement réussi',
    'Admin.Delivery.App.Thank.For.Payment': 'Merci de votre paiement. Vous êtes prêt.',
    'Admin.Delivery.App.Back.App': "Retour à l'application",
    'Admin.Delivery.App.Select.Serving.Till.Time': "Sélectionnez l'heure de service de cloture",
    'Admin.Delivery.App.Select.Serving.From.Time': "Sélectionnez l'heure de service A Partir De",
    'Admin.Delivery.App.Support': 'Support',
    'Admin.Delivery.App.Support.Manager': 'Responsable du support',
    'Admin.Delivery.App.New.Restaurants': 'Nouveaux restaurants',
    'Admin.Delivery.App.Cancel.Order': 'Annuler cette commande',
    'Admin.Delivery.App.Delivered.Order': "J'ai livré cette commande",
    'Admin.Delivery.App.Change.Order.Status.Confirmation': 'Êtes-vous sûr de vouloir modifier le statut de la commande ?',
    'Admin.Driver.Delivery.App.View.Order.Details': 'Afficher les détails de la commande',
    'Admin.Driver.Delivery.App.View.Booking.Details': 'Voir les détails de la réservation',
    'Admin.Delivery.App.Change.Order.Status': 'Modifier le statut de la commande',
    'Admin.Delivery.App.Payment.Failed': 'Paiement échoué',
    'Admin.Delivery.App.Payment.Failed.Description': 'Votre paiement a échoué. Veuillez réessayer.',
    'Admin.Delivery.App.Deliver.Order': 'Livrer cette commande',
    'Admin.Delivery.App.Opening.Time.Required': "*L'heure d'ouverture est obligatoire",
    'Admin.Delivery.App.Closing.Time.Required': "*L'heure de fermeture est obligatoire",
    'Admin.Delivery.App.One.Meal.Time.Required': '*Veuillez sélectionner au moins une heure de repas.',
    'Admin.Delivery.App.Average.Preparation.Time.Required': '*Un temps de préparation moyen est requis',
    'Admin.Delivery.App.All.Time.Required': '*Le debut de temps de service, la fin de temps de service et le temps moyen de préparation sont tous obligatoires.', // TODO Add Transalation
    'Admin.Delivery.App.Category.Required': '*La catégorie est obligatoire!',
    'Admin.Delivery.App.Select.Max.Category.Required': "Vous ne pouvez sélectionner que jusqu'à 5 catégories.",
    'Admin.Delivery.App.Transaction.Initiated': 'Transaction initiée',
    'Admin.Delivery.App.PayTech': 'PayTech',
    'Admin.Delivery.App.Wave': 'Wave',
    'Admin.Delivery.App.Skip': 'Sauter',
    'Admin.Delivery.App.Onboarding': 'Enrollment',
    'Admin.Delivery.App.UpdateLicenceDetail': 'Mettre à jour les détails de la licence',
    'Admin.Delivery.App.UpdateVehicleInsurance': "Mettre à jour l'assurance du véhicule",
    'Admin.Delivery.App.UpdateVehicleRegistration': "Mettre à jour l'immatriculation du véhicule",
    'Admin.Delivery.App.DriverBank': 'Banque de conducteurs',
    'Admin.Delivery.App.SellerOnboardingRequests': "Demande d'Enrollment des vendeurs",
    'Admin.Delivery.App.DocumentApprovalRequests': "Demandes d'approbation de documents",
    'Admin.Delivery.App.CategoryTagUpdates': 'Mises à jour catégorie de Tags',
    'Admin.Delivery.App.FeaturedImageUpdates': 'Mises à jour des images en vedette',
    'Admin.Delivery.App.ServingTimeChanges': 'Modifications des délais de service',
    'Admin.Delivery.App.Orange.Money.Payment': 'ORANGE MONEY',
    'Admin.Delivery.App.Wave.Payment': 'WAVE',
    'Admin.Delivery.App.Bank.Payment': 'VIREMENT BANCAIRE',
    'Admin.Delivery.App.Driver.Phone.Number': 'Numéro de Téléphone du Livreur',
    'Admin.Delivery.App.Wallet.Details': 'Détails Portefeuille',

    // new key
    'Admin.Delivery.App.Dashboard.Title': 'Dashboard', //TODO translation
    'Admin.Delivery.App.Request.Title': 'Request', //TODO translation
    'Admin.Delivery.App.Driver.Title': ' Drivers  Details', //TODO translation
    'Admin.Delivery.App.Message': ' Message', //TODO translation
    'Admin.Delivery.App.Booking.History': 'Booking History', //TODO translation
    'Admin.Delivery.App.Booking.Suspend': 'Suspend', //TODO translation
    'Admin.Delivery.App.Brand.Name': 'Taxi App', //TODO translation
    'Admin.Delivery.App.Theme.Dark': 'Dark theme', //TODO translation
    'Admin.Delivery.App.Theme.Light': 'Light theme', //TODO translation
    'Admin.Delivery.App.Rate.Tiers.Management': 'Rate Tiers  Management', //TODO translation
    'Admin.Delivery.App.Rate.Tiers.Details': 'Rate Tiers Details', //TODO translation
    'Admin.Delivery.App.Base.Price': 'Base Price', //TODO translation
    'Admin.Delivery.App.Price.Per.Km': 'Price Per Km', //TODO translation
    'Admin.Delivery.App.Enter.Base.Price': 'Enter Base Price', //TODO translation
    'Admin.Delivery.App.Enter.Price.Per.Km': 'Enter Price Per Km', //TODO translation
    'Admin.Delivery.App.Vehicle.Category': 'Vehicle Category', //TODO translation
    'Admin.Delivery.App.Vehicle.Type': 'Vehicle Type', //TODO translation
    'Admin.Delivery.App.Vehicle.Category.required': '*Vehicle Category is required', //TODO translation
    'Admin.Delivery.App.Vehicle.Type.required': '*Vehicle Type is required', //TODO translation
    'Admin.Delivery.App.Base.Price.required': '*Base Price is required', //TODO translation
    'Admin.Delivery.App.Price.Per.Km.Type.required': '*Price Per Km is required', //TODO translation
    'Admin.Delivery.App.CancellationCharges': 'Cancellation Charges', //TODO translation
    'Admin.Delivery.App.Enter.CancellationCharges': 'Enter Cancellation Charges %', //TODO translation
    'Admin.Delivery.App.CancellationCharges.required': '*Cancellation Charges is required', //TODO translation
    'Admin.Delivery.App.WaitingChargePerMinute': 'Waiting Charge Per Minute', //TODO translation
    'Admin.Delivery.App.Enter.WaitingChargePerMinute': 'Enter Waiting Charge Per Minute', //TODO translation
    'Admin.Delivery.App.WaitingChargePerMinute.required': '*Waiting Charge Per Minute is required', //TODO translation
    'Admin.Delivery.App.WaitingChargePerMinute.invalid': '*Please enter a valid waiting charge', //TODO translation
    'Admin.Delivery.App.WaitingChargePerMinute.exceeds': '*Waiting charge cannot exceed price per km', //TODO translation
    'Admin.Delivery.App.NonChargeableWaitingTime': 'Non-Chargeable Waiting Time (mins)', //TODO translation
    'Admin.Delivery.App.Enter.NonChargeableWaitingTime': 'Enter Non-Chargeable Waiting Time', //TODO translation
    'Admin.Delivery.App.NonChargeableWaitingTime.required': '*Non-Chargeable Waiting Time is required', //TODO translation
    'Admin.Delivery.App.NonChargeableWaitingTime.invalid': '*Please enter a valid waiting time', //TODO translation
    'Admin.Delivery.App.City.Id': 'City Id', //TODO translation
    'Admin.Delivery.App.Four.Wheeler': 'Four Wheeler', //TODO translation
    'Admin.Delivery.App.Vehicle.Category.SUV': 'SUV', //TODO translation
    'Admin.Delivery.App.Vehicle.Category.Standard': 'STANDARD', //TODO translation
    'Admin.Delivery.App.Vehicle.Category.FullSize': 'FULL SIZE', //TODO translation
    'Admin.Delivery.App.Bookings.Title': 'All Bookings', //TODO translation
    'Admin.Delivery.App.RequestManagementList.Table.Booking.ID': 'Booking ID', //TODO translation
    'Admin.Delivery.App.RequestManagementList.Table.Pickup.Location': 'Pickup Location', //TODO translation
    'Admin.Delivery.App.RequestManagementList.Table.Drop.off.Location': 'Drop off Location', //TODO translation
    'Admin.Delivery.App.Booking.Heading.Title': 'All Booking List', //TODO translation
    'Admin.Delivery.App.Trip.Details': 'Trip Details', //TODO translation
    'Admin.Delivery.App.Bill.Details': 'Bill Details', //TODO translation
    'Admin.Delivery.App.Trip.Title': 'Your Trip', //TODO translation
    'Admin.Delivery.App.Waiting.Charges': 'Waiting Charges', //TODO translation
    'Admin.Delivery.App.Cancellation.Charge': 'Cancellation Charge', //TODO translation
    'Admin.Delivery.App.Advance.Booking.Fee': 'Advance Booking Fee', //TODO translation
    'Admin.Delivery.App.Special.Discount': 'Special Discount', //TODO translation
    'Admin.Delivery.App.Rounded.Off': 'Rounded Off', //TODO translation
    'Admin.Delivery.App.Total.Bill': 'Total Bill', //TODO translation
    'Admin.Delivery.App.Total.Payable': 'Total Payable', //TODO translation
    'Admin.Delivery.App.Payment.Title': 'Payment', //TODO translation
    'Admin.Delivery.App.Cash.Title': 'Cash', //TODO translation
    'Admin.Delivery.App.Get.invoice.copy': 'Get invoice copy', //TODO translation
    'Admin.Delivery.App.Get.help': 'Get help', //TODO translation
    'Admin.Delivery.App.Cabs.Title': 'Cabs', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status': 'Ride Status', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.Completed': 'Completed', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.Scheduled': 'Scheduled', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.Requested': 'Requested', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.Rider.Assigned': 'Rider Assigned', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.DriverId': 'Driver Id:', //TODO translation
    'Admin.Delivery.App.Booking.Assign.Rider.Success': 'Rider assigned successfully', //TODO translation
    'Admin.Delivery.App.Booking.Unassign.Rider.Success': 'Rider unassigned successfully', //TODO translation
    'Admin.Delivery.App.Booking.Cancel.Success': 'Booking cancelled successfully', //TODO translation
    'Admin.Delivery.App.InvoiceSettle.Loading': 'Settling...', //TODO translation
    'Admin.Delivery.App.InvoiceSettle.Selected': 'Settle Selected ({{count}})', //TODO translation
    'Admin.Delivery.App.Assignment.Loading': 'Checking rider schedule...', //TODO translation
    'Admin.Delivery.App.Assigning.Driver': 'Assigning driver...', //TODO translation
    'Admin.Delivery.App.Unassign.Rider': 'Unassign Rider', //TODO translation
    'Admin.Delivery.App.Unassign.Rider.Confirmation': 'Are you sure you want to unassign the current rider from this ride?', //TODO translation
    'Admin.Delivery.App.Assign.Ride.Schedule.Conflict.Note': 'This driver already has an upcoming ride scheduled for this time.', //TODO translation
    'Admin.Delivery.App.Includes.Taxes': 'Includes Taxes', //TODO translation
    'Admin.Delivery.App.BookingHistory.AllRides': 'All Rides', //TODO translation
    'Admin.Delivery.App.BookingHistory.Local': 'Local', //TODO translation
    'Admin.Delivery.App.BookingHistory.Intercity': 'Intercity', //TODO translation
    'Admin.Delivery.App.Cancel.Booking.QuickReasons': 'Quick reasons', //TODO translation
    'Admin.Delivery.App.Complete.Ride': 'Complete Ride', //TODO translation
    'Admin.Delivery.App.Complete.Ride.Confirmation': 'Are you sure you want to mark this ride as completed?', //TODO translation
    'Admin.Delivery.App.Complete.Ride.Success': 'Ride marked as completed successfully.', //TODO translation
    'Admin.Delivery.App.Booking.Cancel.Success': 'Booking cancelled successfully.', //TODO translation
    'Admin.Delivery.App.Intercity.Ride.Details': 'Intercity Ride Details', //TODO translation
    'Admin.Delivery.App.Round.Trip.Details': 'Round Trip Details', //TODO translation
    'Admin.Delivery.App.Show.On.Map': 'Show on Map', //TODO translation
    'Admin.Delivery.App.Hide.Map': 'Hide Map', //TODO translation
    'Admin.Delivery.App.Show.Round.Trip': 'Round Trip', //TODO translation
    'Admin.Delivery.App.Show.Main.Trip': 'Main Trip', //TODO translation
    'Admin.Delivery.App.Requested.Cab.Type': 'Requested Cab Type', //TODO translation
    'Admin.Delivery.App.Requested.Ride.Date': 'Requested Ride Date', //TODO translation
    'Admin.Delivery.App.Cancel.Reason.Driver.Unavailable': 'Driver unavailable', //TODO translation
    'Admin.Delivery.App.Cancel.Reason.Customer.Requested': 'Customer requested cancellation', //TODO translation
    'Admin.Delivery.App.Cancel.Reason.Schedule.Conflict': 'Schedule conflict', //TODO translation
    'Admin.Delivery.App.Cancel.Reason.Vehicle.Issue': 'Vehicle issue', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.Arrived.At.Pickup': 'Arrived at pickup location', //TODO translation
    'Admin.Delivery.App.Booking.Ride.Status.Ride.InProgress': 'In-progress', //TODO translation
    'Admin.Delivery.App.Driver.Booking.Heading.Title': 'Driver Booking List', //TODO translation
    'Admin.Delivery.App.Customer.Booking.Heading.Title': 'Customer Booking List', //TODO translation
    'Admin.Delivery.App.Driver.Rides': 'Livraisons', //TODO translation
    'Admin.Delivery.App.Driver.Ride.Partners': 'Ride Partners', //TODO translation
    'Admin.Delivery.App.Accident': 'I met with an accident', //TODO translation
    'Admin.Delivery.App.Address.Not.Found': 'Couldn’t find the pickup location', //TODO translation
    'Admin.Delivery.App.Passenger.Didnot.shown': 'Passenger didn’t show up for pickup', //TODO translation
    'Admin.Delivery.App.Route.Changed': 'Passenger changed the route midway', //TODO translation
    'Admin.Delivery.App.Passenger.Not.Ready': 'Passenger wasn’t ready for pickup', //TODO translation
    'Admin.Delivery.App.User.Not.Contactable': 'Passenger was not reachable', //TODO translation
    'Admin.Delivery.App.Wrong.Destination': 'Wrong destination entered by passenger', //TODO translation
    'Admin.Delivery.App.SearchBy.Address': 'Search by address', //TODO translation
    'Admin.Delivery.App.SearchBy.VehicleNumber': 'Search by vehicle number', //TODO translation
    'Admin.Delivery.App.Ticket.Raised': 'Ticket Raised', //TODO translation
    'Admin.Delivery.App.Did.Not.Arrive': 'Driver didn’t arrive / couldn’t find me', //TODO translation
    'Admin.Delivery.App.Unsafe': 'Unsafe driving / rude behavior', //TODO translation
    'Admin.Delivery.App.Double.Charge': 'Double charge for ride', //TODO translation
    'Admin.Delivery.App.Wrong.Route': 'Wrong route taken', //TODO translation
    'Admin.Delivery.App.Track.Issue': 'Could not track driver location', //TODO translation
    'Admin.Delivery.App.Cancelled.Charged': 'Driver cancelled but I was charged', //TODO translation
    'Admin.Delivery.App.Cannot.Update.Destination': 'Can’t update destination', //TODO translation
    'Admin.Delivery.App.Other.Reason': 'Other Reason', //TODO translation
    'Admin.Delivery.App.App.Share': 'App Share', //TODO translation
    'Admin.Delivery.App.Enter.App.Share': 'Enter App Price', //TODO translation
    'Admin.Delivery.App.Business.Share.required': '*Business Share is required', //TODO translation
    'Admin.Delivery.App.Create.Role': 'Create New Role', //TODO translation
    'Admin.Delivery.App.Role.Name': 'Role Name', //TODO translation
    'Admin.Delivery.App.Role.Details': 'Role Details', //TODO translation
    'Admin.Delivery.App.Role': 'Role', //TODO translation
    'Admin.Delivery.App.Module': 'Module', //TODO translation
    'Admin.Delivery.App.View': 'View', //TODO translation
    'Admin.Delivery.App.Edit': 'Edit', //TODO translation
    'Admin.Delivery.App.Roles.Label': 'Roles', //TODO translation
    'Admin.Delivery.App.Create.Label': 'Create Role', //TODO translation
    'Admin.Delivery.App.Role.Name.Required': 'Role name is required',
    'Admin.Delivery.App.Role.Description.Required': 'Description is required',
    'Admin.Delivery.App.Role.Permissions.Required': 'Atleast 1 permission is required',
    'Admin.Delivery.App.Edit.Role': 'Edit Role',
    'Admin.Delivery.App.Update.Label': 'Update Role',
    'Admin.Delivery.App.Dashboard.RoleManagement': 'Role Management',
    'Admin.Delivery.App.Users.Label': 'Users',
    'Admin.Delivery.App.Edit.User.Details': 'Edit User',
    'Admin.Delivery.App.Password.MinLength': 'Le mot de passe doit contenir au moins 6 caractères',
    'Admin.Delivery.App.Password.UpperCase': 'Le mot de passe doit contenir au moins une lettre majuscule',
    'Admin.Delivery.App.Password.LowerCase': 'Le mot de passe doit contenir au moins une lettre minuscule',
    'Admin.Delivery.App.Password.Digit': 'Le mot de passe doit contenir au moins un chiffre',
    'Admin.Delivery.App.Password.SpecialChar': 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)',
    'Admin.Delivery.App.Password.Confirm.Required': 'La confirmation du mot de passe est requise',
    'Admin.Delivery.App.Password.Mismatch': 'Les mots de passe ne correspondent pas',
    'Admin.Delivery.App.Role.Required': 'Le rôle est requis',
    'Admin.Delivery.App.User.Details': "Détails de l'utilisateur",
    'Admin.Delivery.App.Select.Role': 'Sélectionner un rôle',
    'Admin.Delivery.App.Create.Role.Label': 'Créer un rôle',
    'Admin.Delivery.App.Update.Role.Label': 'Mettre à jour le rôle',
    'Admin.Delivery.App.Super.Admin.Label': 'Super Admin', //TODO translation
    'Admin.Delivery.App.Business.LogoTitle': 'Business Logo', //TODO translation
    'Admin.Delivery.App.Business.NameLabel': 'Business name', //TODO translation
    'Admin.Delivery.App.Business.OwnerLabel': 'Business owner', //TODO translation
    'Admin.Delivery.App.Business.EmailLabel': 'Business email', //TODO translation
    'Admin.Delivery.App.Business.PhoneLabel': 'Business phone', //TODO translation
    'Admin.Delivery.App.Business,PhonePlaceholder': 'Enter phone number', //TODO translation
    'Admin.Delivery.App.Business.NamePlaceHolder': 'Enter Company name', //TODO translation
    'Admin.Delivery.App.BusinessManagement.Heading': 'Business Management', //TODO translation
    'Admin.Delivery.App.Business.BusinessManager': 'Business Detail', //TODO translation
    'Admin.Delivery.App.AddNewBusiness': 'Add New Business', //TODO translation
    'Admin.Delivery.App.AddBusiness': 'Add Business', //TODO translation
    'Admin.Delivery.App.Business.Table.BusinessId': 'Business ID', //TODO translation
    'Admin.Delivery.App.Business': 'Business', //TODO translation
    'Admin.Delivery.App.Business.Information': 'Business Information', //TODO translation
    'Admin.Delivery.App.Company.LogoTitle': 'Company Logo', //TODO translation
    'Admin.Delivery.App.Business.FleetSize': 'Fleet Size', //TODO translation
    'Admin.Delivery.App.Business.NumberOfDriver': 'Number Of Driver', //TODO translation
    'Admin.Delivery.App.FleetSize.required': '*Fleet Size is required', //TODO translation
    'Admin.Delivery.App.NumberOfDriver.required': '*Number Of Driver is required', //TODO translation
    'Admin.Delivery.App.BusinessAddress.required': '*Business Address is required', //TODO translation
    'Admin.Delivery.App.BusinessAddress': 'Buisness Address', //TODO translation
    'Admin.Delivery.App.Company.Logo.Required': "Logo de l'entreprise requis",
    'Admin.Delivery.App.Popular': 'POPULAIRE',
    'Admin.Delivery.App.Features': 'Fonctionnalités',
    'Admin.Delivery.App.Select.Plan': 'Sélectionnez votre plan',
    'Admin.Delivery.App.Select.Plan.Fixed': 'Fixe',
    'Admin.Delivery.App.Business.CustomPlan': 'Plan personnalisé',
    'Admin.Delivery.App.Business.PlanConfiguration': 'Configuration du plan',
    'Admin.Delivery.App.Business.PlanName': 'Nom du plan',
    'Admin.Delivery.App.Business.PlanNamePlaceholder': 'Entrez le nom du plan',
    'Admin.Delivery.App.Business.PlanNameRequired': 'Le nom du plan est requis',
    'Admin.Delivery.App.Business.Months': 'Durée (Mois)',
    'Admin.Delivery.App.Business.MonthsPlaceholder': 'Entrez le nombre de mois',
    'Admin.Delivery.App.Business.MonthsRequired': 'La durée est requise',
    'Admin.Delivery.App.Business.MonthsInvalid': 'Veuillez entrer un nombre de mois valide',
    'Admin.Delivery.App.Business.MonthsMaxExceeded': 'La durée ne peut pas dépasser 999 mois',
    'Admin.Delivery.App.Business.RiderLimit': 'Limite de passagers',
    'Admin.Delivery.App.Business.RiderLimitPlaceholder': 'Entrez la limite de passagers',
    'Admin.Delivery.App.Business.RiderLimit.Required': 'La limite de passagers est requise',
    'Admin.Delivery.App.Business.RiderLimitInvalid': 'Veuillez entrer une limite de passagers valide',
    'Admin.Delivery.App.Business.VehiclesInvalid': 'Veuillez entrer un nombre de véhicules valide',
    'Admin.Delivery.App.Business.SelectBenefits': 'Sélectionner les avantages',
    'Admin.Delivery.App.Business.SelectAtLeastOneBenefit': 'Veuillez sélectionner au moins un avantage',
    'Admin.Delivery.App.Business.NoBenefitsAvailable': 'Aucun avantage disponible',
    'Admin.Delivery.App.Business.BenefitsLoadError': 'Échec du chargement des avantages',
    'Admin.Delivery.App.Business.CreatePlan': 'Créer le plan',
    'Admin.Delivery.App.Business.EditPlan': 'Modifier le plan',
    'Admin.Delivery.App.Business.Creating': 'Création en cours...',
    'Admin.Delivery.App.Business.PlanCreatedSuccess': 'Plan personnalisé créé avec succès!',
    'Admin.Delivery.App.Business.PleaseCompleteForm': 'Veuillez remplir tous les champs obligatoires',
    'Admin.Delivery.App.Business.PleaseSelectPlan': 'Veuillez sélectionner un plan pour continuer',
    'Admin.Delivery.App.Business.Month': 'month',
    'Admin.Delivery.App.Business.NumberOfVehiclesRequired': 'Number of vehicles is required',
    'Admin.Delivery.App.Business.NumberOfVehiclesInvalid': 'Please enter a valid number of vehicles',
    'Admin.Delivery.App.Business.Base.Price': 'Prix de base',
    'Admin.Delivery.App.Business.Base.PricePlaceholder': 'Entrez le prix de base',
    'Admin.Delivery.App.Business.Base.PriceRequired': 'Le prix de base est requis',
    'Admin.Delivery.App.Business.BasePriceInvalid': 'Veuillez entrer un prix de base valide',
    'Admin.Delivery.App.Business.MonthlyCharges': 'Frais mensuels',
    'Admin.Delivery.App.Business.MonthlyChargesPlaceholder': 'Entrez les frais mensuels',
    'Admin.Delivery.App.Business.MonthlyChargesRequired': 'Les frais mensuels sont requis',
    'Admin.Delivery.App.Business.MonthlyChargesInvalid': 'Veuillez entrer des frais mensuels valides',
    'Admin.Delivery.App.Business.OnboardingFirstTimeCharge': 'Frais initiaux d onboarding',
    'Admin.Delivery.App.Business.OnboardingFirstTimeChargePlaceholder': 'Entrez les frais initiaux d onboarding',
    'Admin.Delivery.App.Business.OnboardingFirstTimeChargeRequired': 'Les frais initiaux d onboarding sont requis',
    'Admin.Delivery.App.Business.OnboardingFirstTimeChargeInvalid': 'Veuillez entrer des frais initiaux d onboarding valides',
    'Admin.Delivery.App.Business.ExtraRideChargePercentage': 'Frais supplémentaires de course (%)',
    'Admin.Delivery.App.Business.ExtraRideChargePercentagePlaceholder': 'Entrez le pourcentage (0-100)',
    'Admin.Delivery.App.Business.ExtraRideChargeRequired': 'Le pourcentage de frais supplémentaires est requis',
    'Admin.Delivery.App.Business.ExtraRideChargeInvalid': 'Veuillez entrer un pourcentage valide',
    'Admin.Delivery.App.Business.ExtraRideChargeRange': 'Le pourcentage doit être entre 0 et 100',
    'Admin.Delivery.App.Business.ShortRideAmount': 'Montant de la course courte (USD)',
    'Admin.Delivery.App.Business.ShortRideAmountPlaceholder': 'Entrez le montant de la course courte',
    'Admin.Delivery.App.Business.ShortRideShareAmount': 'Notre part pour course courte (USD)',
    'Admin.Delivery.App.Business.ShortRideShareAmountPlaceholder': 'Entrez notre part pour course courte',
    'Admin.Delivery.App.Business.LongRideAmount': 'Montant de la course longue (USD)',
    'Admin.Delivery.App.Business.LongRideAmountPlaceholder': 'Entrez le montant de la course longue',
    'Admin.Delivery.App.Business.LongRideShareAmount': 'Notre part pour course longue (USD)',
    'Admin.Delivery.App.Business.LongRideShareAmountPlaceholder': 'Entrez notre part pour course longue',
    'Admin.Delivery.App.Business.RideShareSetup': 'Configuration du partage de course',
    'Admin.Delivery.App.Business.PlanShareRequired': 'Entrez le pourcentage par course ou completez les details de course courte et longue',
    'Admin.Delivery.App.Business.RideAmountRequired': 'Ce montant de course est requis',
    'Admin.Delivery.App.Business.RideAmountInvalid': 'Veuillez entrer un montant de course valide',
    'Admin.Delivery.App.Business.RideShareAmountRange': 'La part ne peut pas etre superieure au montant de la course',
    //TODO translation
    'Admin.Delivery.App.Information.Success': 'Information submitted successfully', //TODO translation
    'Admin.Delivery.App.Document.Success': 'Documents submitted successfully', //TODO translation
    //TODO translation
    'Admin.Delivery.App.Bank.Details.Success': 'Bank details submitted successfully', //TODO translation
    'Admin.Delivery.App.FullName': 'Full Name', //TODO translation
    'Admin.Delivery.App.Assigned.Country': 'Assigned Country', //TODO translation
    'Admin.Delivery.App.Assigned.City': 'Assigned City', //TODO translation
    'Admin.Delivery.App.Select.Country.Label': 'Select Country', //TODO translation
    'Admin.Delivery.App.Select.City.Label': 'Select City', //TODO translation
    'Admin.Delivery.App.Phone.Number': 'Phone No.', //TODO translation
    'Admin.Delivery.App.Email': 'Email', //TODO translation
    'Admin.Delivery.App.PersonalInfoTitle': 'Personal Information', //TODO translation
    'Admin.Delivery.App.EmergencyInfoTitle': 'Emergency Contact Information', //TODO translation
    'Admin.Delivery.App.LegalDocument': 'Legal & Compliance Documents', //TODO translation
    'Admin.Delivery.App.License.Success': 'License Proof uploaded successfully.', //TODO translation
    'Admin.Delivery.App.Registration.Success': 'Registration Papers uploaded successfully.', //TODO translation
    'Admin.Delivery.App.Insurance.Success': 'Insurance Document uploaded successfully.', //TODO translation
    'Admin.Delivery.App.License.Proof.Title': 'License Proof', //TODO translation
    'Admin.Delivery.App.Vechicle.Not.Empty': '*Vechicle type cannot empty', //TODO translation
    'Admin.Delivery.App.Vechicle.Insurance.Not.Empty': '*Vechicle Insurance Number cannot empty', //TODO translation
    'Admin.Delivery.App.Vechicle.Document.Not.Empty': '*Insurance Document Required', //TODO translation
    'Admin.Delivery.App.Legal.Upload': 'Upload up to 2 files as PDF, DOCX, or JPEG, up to 10 MB each', //TODO translation
    'Admin.Delivery.App.Registration.Papers.Title': 'Registration Papers', //TODO translation
    'Admin.Delivery.App.Insurance.Document.Title': 'Insurance Document', //TODO translation
    'Admin.Delivery.App.Vehicle.License.Number': "Driver's License Number", //TODO translation
    'Admin.Delivery.App.Vehicle.Type.Placeholder': 'Select Vehicle', //TODO translation
    'Admin.Delivery.App.Two.Wheeler': 'Two Wheeler', //TODO translation
    'Admin.Delivery.App.Tap.To.Upload': 'Tap to Upload', //TODO translation
    'Admin.Delivery.App.License.Expiry.Date': "Driver's License Expiry Date", //TODO translation
    'Admin.Delivery.App.License.Expiry.Date.Select': 'Select Expiry Date', //TODO translation
    'Admin.Delivery.App.Vehicle.Registration.Number': 'Registration No. of Vehicle', //TODO translation
    'Admin.Delivery.App.Vehicle.Number': 'Vehicle Insurance No.', //TODO translation
    'Admin.Delivery.App.TermsLabel': 'I agree to a background check.', //TODO translation
    'Admin.Delivery.App.OTP.Required': 'OTP required', //TODO translation
    'Admin.Delivery.App.Otp.Invalid': 'Expired OTP. Please try again.', //TODO translation
    'Admin.Delivery.App.Bank.Payment.Title': 'Preferred Payment Method',
    'Admin.Delivery.App.Bank.Account.Number': 'Bank Account Number', //TODO translation
    'Admin.Delivery.App.Bank.ReAccount.Number': 'Re-enter Bank Account Number', //TODO translation
    'Admin.Delivery.App.Bank.IFSC-Code': 'IFSC code', //TODO translation
    'Admin.Delivery.App.Bank.Payment.Drop': 'Bank Transfer', //TODO translation
    'Admin.Delivery.App.Banking.Details': 'Banking Details', //TODO translation
    'Admin.Delivery.BANKTRANSFER': 'BANK TRANSFER', //TODO translation
    'Admin.Delivery.ORANGETRANSFER': 'ORANGE TRANSFER', //TODO translation
    'Admin.Delivery.WAVE': 'WAVE', //TODO translation
    'Admin.Delivery.App.RIB.Number': 'RIB Number', //TODO translation
    'Admin.Delivery.App.RIB.ReRIB.Number': 'Re-enter RIB Number', //TODO translation
    'Admin.Delivery.App.Bank.Name': 'Account Holder Name', //TODO translation
    'Admin.Delivery.App.RIB.Number.Required': '*RIB number is required', //TODO translation
    'Admin.Delivery.App.RIB.Number.Length': 'RIB number must be 18 to 25 digits', //TODO translation
    'Admin.Delivery.App.RIB.Number.Invalid': 'Invalid RIB Number',
    'Admin.Delivery.App.Confirm.RIB.Number.Required': 'Re-enter RIB number', //TODO translation
    'Admin.Delivery.App.Bank.Payment.Method.Required': '*Payment method is required', //TODO translation
    'Admin.Delivery.App.Set.Primary.Account': 'Set as primary account', //TODO translation
    'Admin.Delivery.App.OTP.Limit': 'Avoid multiple OTP requests (max 5 per 10 mins) to prevent blocking.', //TODO translation
    'Admin.Delivery.App.Note.Label': 'Note', //TODO translation
    'Admin.Delivery.App.Mobile.Number': 'Mobile Number', //TODO translation
    'Admin.Delivery.App.Re-Mobile.Number': 'Re-enter Mobile Number', //TODO translation
    'Admin.Delivery.App.Mobile.Number.Required': '*Mobile number is required', //TODO translation
    'Admin.Delivery.App.Re-Mobile.Number.Required': '*Re-enter number is required', //TODO translation
    'Admin.Delivery.App.Mobile.Number.Invalid': 'Invalid mobile number', //TODO translation
    'Admin.Delivery.App.Bank.Account.Holder.Name.Required': '*Account holder name is required', //TODO translation
    'Admin.Bank.Details.IFSC.Required': '*Required IFSC Code', //TODO translation
    'Admin.Delivery.App.Error.Character.Limit.Field': 'Character Limit cannot exceed {{characterLimit}}', //TODO translation
    'Admin.Bank.Details.paymentMode.Required': '*Required payment mode', //TODO translation
    'Admin.Bank.Details.AccountNumber.Required': '*Required account number', //TODO translation
    'Admin.Bank.Details.AccountNumber.Invalid': 'Invalid Account number', //TODO translation
    'Admin.Bank.Details.ConfirmAccountNumber.Required': '*Required confirm account number', //TODO translation
    'Admin.Bank.Details.AccountNumber.Mismatch': 'Account number mismatch', //TODO translation
    'Admin.Delivery.App.Upload.From.Gallery': 'Upload from gallery', //TODO translation
    'Admin.Delivery.App.Take.Photo': 'Take a Photo', //TODO translation
    'Admin.Delivery.App.Male.Label': 'Male', //TODO translation
    'Admin.Delivery.App.Female.Label': 'Female', //TODO translation
    'Admin.Delivery.App.Online.Label': 'Online', //TODO translation
    'Admin.Delivery.App.Debit.Card.Label': 'Debit Card', //TODO translation
    'Admin.Delivery.App.Credit.Card.Label': 'Credit Card', //TODO translation
    'Admin.Delivery.App.UPI.Payment.Label': 'UPI Payment', //TODO translation
    'Admin.Delivery.App.ProfileImage.Required': '*Required Profile Photo', //TODO translation
    'Admin.Delivery.App.Emergency.Contact.SameAsPrimary': 'Emergency contact number should be different from your registered phone number', //TODO translation
    'Admin.Delivery.App.Licence.Required': '*License number required', //TODO translation
    'Admin.Delivery.App.License.Number.Alphanumeric': 'License number can only contain alphanumeric characters and dashes', //TODO translation
    'Admin.Delivery.App.Background.Consent': '*Background Consent Required', //TODO translation
    'Admin.Delivery.App.Licence.Expiry.Required': '*License expiry date required', //TODO translation
    'Admin.Delivery.App.Licence.Expired': 'License is expired', //TODO translation
    'Admin.Delivery.App.Licence.ExpiryTooFar': 'Enter valid License expiry date', //TODO translation
    'Admin.Delivery.App.Registration.Vehicle.Insurance': '*Vehicle registration number is required if insurance number is provided.', //TODO translation
    'Admin.Delivery.App.Registration.Empty': '*Registration number cannot be empty', //TODO translation
    'Admin.Delivery.App.Registration.SpecialCharacter': 'Registration number can only contain alphanumeric characters and dashes', //TODO translation
    'Admin.Delivery.App.Insurance.SpecialCharacter': 'Insurance number can only contain alphanumeric characters and dashes', //TODO translation
    'Admin.Delivery.App.Address': 'Residential Address', //TODO translation
    'Admin.Delivery.App.Relationship': 'Relationship', //TODO translation
    'Admin.Delivery.App.Primary.Account.Required': '*Set primary account is required', //TODO translation
    'Admin.Delivery.App.Re-Mobile.Mobile.Required': '*Re-enter mobile number is required', //TODO translation
    'Admin.Delivery.App.Review.Data': 'All submitted information will be sent to the admin for review. Do you want to proceed?', //TODO translation
    'Admin.Delivery.Driver.Onboarding': 'Driver Onboarding', //TODO translation
    'Admin.Delivery.Add.Driver': 'Add Driver', //TODO translation
    'Admin.Delivery.App.Name.Required': '*Name required', //TODO translation
    'Admin.Delivery.App.MobileNumber.Required': '*Mobile number required', //TODO translation
    'Admin.Delivery.App.Dob.Required': '*Date of birth required', //TODO translation
    'Admin.Delivery.App.City.Required': '*City required', //TODO translation
    'Admin.Delivery.App.Country.Required': '*Country required', //TODO translation
    'Admin.Delivery.App.Vehicle.Type.Required': 'Vehicle Type Required', //TODO translation
    'Admin.Delivery.App.Vehicle.Type.Category.Required': '*Vehicle Category Required', //TODO translation
    'Admin.Delivery.App.Registration.Required': '*Registration number required', //TODO translation
    'Admin.Delivery.App.Vehicle.Name.Error': '*Vehicle name required', //TODO translation
    'Admin.Delivery.App.Vehicle.Type.Category': 'Vehicle Category', //TODO translation
    'Admin.Delivery.App.Vehicle.Name': 'Vehicle Name', //TODO translation
    'Admin.Delivery.App.Add.Email': 'Add Email Address', //TODO translation
    'Admin.Delivery.App.Close': 'Close', //TODO translation
    'Admin.Delivery.App.EnterOtp': 'Enter otp', //TODO translation,
    'Admin.Delivery.App.Verify': 'Verify', //TODO translation,
    'Admin.Delivery.App.VerifyOtp': 'Verify Otp', //TODO translation,
    'Admin.Delivery.App.Otp': 'Otp', //TODO translation,
    'Admin.Delivery.App.InvalidName': 'Invalid name', //TODO translation,
    'Admin.Delivery.App.Not.Empty': 'Name cannot be empty', //TODO translation,
    'Admin.Delivery.App.Name.Validation': 'Please enter a valid full name containing only alphabets and spaces', //TODO translation,
    'Admin.Delivery.App.Edit.Details': 'Edit Details', //TODO translation,
    'Admin.Delivery.App.RIB.Numbers.Do.Not.Match': 'RIB number does not match', //TODO translation,
    'Admin.Delivery.App.Business.AddSuccessMessage': 'Business added successfully', //TODO translation,
    'Admin.Delivery.App.Access.Denied': 'Accès refusé', //TODO translation,
    'Admin.Delivery.App.No.Permission.Message': "Vous n'avez pas la permission d'accéder à cette page. Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.", //TODO translation,
    'Admin.Delivery.App.Mobile.Numbers.Do.Not.Match': 'Mobile number do not match', //TODO translation,
    'Admin.Delivery.App.Role.Deactivate.Title': 'Are you sure you want to deactivate the role?', //TODO translation,
    'Admin.Delivery.App.Role.Deactivate.Message': 'All user associated with this role would be deactivated', //TODO translation,
    'Admin.Delivery.App.Search.Country': 'Search Country', //TODO translation,
    'Admin.Delivery.App.Confirmation.Required': 'Confirmation Required', //TODO translation,
    'Admin.Delivery.App.NewBooking.Notification.Badge': 'Nouvelle demande', //TODO translation,
    'Admin.Delivery.App.NewBooking.Notification.Title': 'Réservation intercité', //TODO translation,
    'Admin.Delivery.App.NewBooking.Notification.ViewRequest': 'Voir la demande', //TODO translation,
    'Admin.Delivery.App.UploadDriverFile': 'Importer des chauffeurs (.xls, .xlsx)',
    'Admin.Delivery.App.UploadDrivers': 'Importer des chauffeurs',
    'Admin.Delivery.App.Upload.Excel': 'Importer uniquement des fichiers Excel (.xls, .xlsx)',
    'Admin.Delivery.App.DriverUploadPreview': 'Aperçu de l\'importation des chauffeurs',
    'Admin.Delivery.App.Preview': 'Aperçu',
    'Admin.Delivery.App.ReviewDriversBeforeUpload': 'Vérifier les chauffeurs avant l\'importation',
    'Admin.Delivery.App.SubmitDrivers': 'Importer les chauffeurs',
    'Admin.Delivery.App.DriversUploadedSuccessfully': 'Chauffeurs importés avec succès',
    'Admin.Delivery.App.NoFileToUpload': 'Aucun fichier à importer',
    'Admin.Delivery.App.FailedToFetchPreviewDrivers': 'Échec de l\'aperçu des chauffeurs',
  },
};

export default frenchLangTranslations;
