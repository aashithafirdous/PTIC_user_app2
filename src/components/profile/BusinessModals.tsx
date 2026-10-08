import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  FullBusinessProfileData, 
  ProductItem, 
  BusinessLocationItem, 
  TeamMemberItem, 
  CertificationItem 
} from '../../data/profileData';
import { 
  Check, 
  Users, 
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '../ui/Toast';

// ============================================================
// 1. EDIT BUSINESS PROFILE HEADER & CORE MODAL
// ============================================================

export interface EditBusinessHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: FullBusinessProfileData;
  onSave: (updated: Partial<FullBusinessProfileData>) => void;
}

export const EditBusinessHeaderModal: React.FC<EditBusinessHeaderModalProps> = ({
  isOpen,
  onClose,
  business,
  onSave,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState(business.name);
  const [tagline, setTagline] = useState(business.tagline);
  const [type, setType] = useState(business.type);
  const [industry, setIndustry] = useState(business.industry);
  const [location, setLocation] = useState(business.location);
  const [website, setWebsite] = useState(business.website);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [description, setDescription] = useState(business.description);

  useEffect(() => {
    setName(business.name);
    setTagline(business.tagline);
    setType(business.type);
    setIndustry(business.industry);
    setLocation(business.location);
    setWebsite(business.website);
    setPhone(business.phone);
    setEmail(business.email);
    setDescription(business.description);
  }, [business, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      tagline: tagline.trim(),
      type,
      industry,
      location: location.trim(),
      website: website.trim(),
      phone: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      initials: name.trim().slice(0, 2).toUpperCase(),
    });
    showToast('Business Profile Updated', name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Business Profile"
      description="Update core commercial enterprise information, enterprise type, and contact channels"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <Input
          label="Business / Enterprise Name *"
          placeholder="e.g. Rajan Poultry Farms & Hatcheries"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Tagline / Positioning"
          placeholder="e.g. Sustainable, High-Performance Broiler Growing & Nursery"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Business Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership Firm">Partnership Firm</option>
              <option value="Private Limited Company">Private Limited Company</option>
              <option value="Contract Grower Federation">Contract Grower Federation</option>
              <option value="Producer Company (FPO)">Producer Company (FPO)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Industry Sector *
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              <option value="Commercial Broiler & Layer Production">Commercial Broiler & Layer Production</option>
              <option value="Poultry Technology & Equipment">Poultry Technology & Equipment</option>
              <option value="Feed Manufacturing & Nutrition">Feed Manufacturing & Nutrition</option>
              <option value="Hatchery Operations">Hatchery Operations</option>
              <option value="Veterinary Pharmaceutical">Veterinary Pharmaceutical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Location *"
            placeholder="Namakkal, Tamil Nadu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Input
            label="Official Website"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Business Phone *"
            placeholder="+91 98421..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Business Inquiry Email *"
            type="email"
            placeholder="contact@..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Business Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your operations, flock numbers, modern equipment installed, and client portfolio..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 2. EDIT BUSINESS ABOUT SECTION MODAL (About AgriTech Solutions / Business)
// ============================================================

export interface EditBusinessAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: FullBusinessProfileData;
  onSave: (data: {
    description: string;
    mission: string;
    vision: string;
    keyDomains: string[];
    businessCategories: string[];
  }) => void;
}

export const EditBusinessAboutModal: React.FC<EditBusinessAboutModalProps> = ({
  isOpen,
  onClose,
  business,
  onSave,
}) => {
  const { showToast } = useToast();
  const [desc, setDesc] = useState(business.description);
  const [mission, setMission] = useState(business.mission);
  const [vision, setVision] = useState(business.vision);
  const [domainsInput, setDomainsInput] = useState(business.keyDomains.join(', '));
  const [categoriesInput, setCategoriesInput] = useState(business.businessCategories.join(', '));

  useEffect(() => {
    setDesc(business.description);
    setMission(business.mission);
    setVision(business.vision);
    setDomainsInput(business.keyDomains.join(', '));
    setCategoriesInput(business.businessCategories.join(', '));
  }, [business, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description: desc.trim(),
      mission: mission.trim(),
      vision: vision.trim(),
      keyDomains: domainsInput.split(',').map((d) => d.trim()).filter(Boolean),
      businessCategories: categoriesInput.split(',').map((c) => c.trim()).filter(Boolean),
    });
    showToast('Business Overview Saved', business.name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit About ${business.name}`}
      description="Refine your commercial mission, long-term vision, core domains and enterprise categories"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Business Description *
          </label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Comprehensive overview of farm facilities, technologies, and poultry services..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Corporate / Enterprise Mission
          </label>
          <textarea
            rows={2}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="e.g. To deliver high-quality, ethically raised broiler flocks with zero antibiotic misuse..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Enterprise Vision
          </label>
          <textarea
            rows={2}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="e.g. To establish Western Tamil Nadu's benchmark smart poultry facilities..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>

        <Input
          label="Key Domains (comma separated)"
          placeholder="e.g. Broiler Production, DOC Nursery, Manure Composting"
          value={domainsInput}
          onChange={(e) => setDomainsInput(e.target.value)}
        />

        <Input
          label="Business Categories (comma separated)"
          placeholder="e.g. Commercial Poultry, Contract Growing, Bio-fertilizer"
          value={categoriesInput}
          onChange={(e) => setCategoriesInput(e.target.value)}
        />
      </form>
    </Modal>
  );
};

// ============================================================
// 3. ADD / EDIT PRODUCT & SERVICE MODAL
// ============================================================

export interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductItem | null;
  onSave: (item: ProductItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [availability, setAvailability] = useState<'In Stock' | 'Made to Order' | 'Available on Request'>('In Stock');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setUnit(productToEdit.unit);
      setDescription(productToEdit.description);
      setFeatures(productToEdit.features.join(', '));
      setAvailability(productToEdit.availability);
      setImageUrl(productToEdit.imageUrl);
    } else {
      setName('');
      setCategory('Commercial Broilers');
      setPrice('₹ 120');
      setUnit('per kg');
      setDescription('');
      setFeatures('High livability, Low FCR, Daily veterinary health monitored');
      setAvailability('In Stock');
      setImageUrl('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80');
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const item: ProductItem = {
      id: productToEdit?.id || `prod-${Date.now()}`,
      name: name.trim(),
      category: category.trim() || 'Commercial Broilers',
      price: price.trim() || 'Negotiable',
      unit: unit.trim() || 'per unit',
      description: description.trim(),
      features: features.split(',').map((f) => f.trim()).filter(Boolean),
      availability,
      verificationStatus: 'PTIC Verified',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
    };

    onSave(item);
    showToast(productToEdit ? 'Product Updated' : 'Product Added', item.name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product / Service' : 'Add Product / Service'}
      description="Publish or update an offering in your catalog with transparent pricing and specs"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {productToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(productToEdit.id);
                showToast('Product Removed', productToEdit.name, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Product
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        {/* Product Image Preview with fixed aspect ratio */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Product Image (Fixed 4:3 Aspect Ratio)
          </label>
          <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] relative flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt={name || 'Preview'} className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-400 text-xs flex flex-col items-center">
                <ImageIcon size={24} className="mb-1 opacity-60" />
                <span>No product image</span>
              </div>
            )}
          </div>
          <Input
            placeholder="Image URL: https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Product / Service Name *"
            placeholder="e.g. Premium Broiler Live Birds (COBB 430Y)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Category *"
            placeholder="e.g. Commercial Broilers"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Price *"
            placeholder="e.g. ₹ 118"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="Unit *"
            placeholder="e.g. per kg (farmgate)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Availability Status
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value as any)}
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
          >
            <option value="In Stock">In Stock / Daily Harvest</option>
            <option value="Made to Order">Made to Order / Pre-Booking</option>
            <option value="Available on Request">Available on Request</option>
          </select>
        </div>

        <Input
          label="Key Features (comma separated)"
          placeholder="e.g. FCR 1.55, Daily Vet Monitored, Antibiotic-Free"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Product Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Technical details, minimum order quantity, delivery logistics..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 4. ADD / EDIT BUSINESS LOCATION MODAL
// ============================================================

export interface AddEditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationToEdit?: BusinessLocationItem | null;
  onSave: (item: BusinessLocationItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditLocationModal: React.FC<AddEditLocationModalProps> = ({
  isOpen,
  onClose,
  locationToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [type, setType] = useState<BusinessLocationItem['type']>('Commercial Farm / Shed');
  const [isPrimary, setIsPrimary] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  useEffect(() => {
    if (locationToEdit) {
      setName(locationToEdit.name);
      setAddress(locationToEdit.address);
      setCity(locationToEdit.city);
      setState(locationToEdit.state);
      setPincode(locationToEdit.pincode);
      setType(locationToEdit.type);
      setIsPrimary(locationToEdit.isPrimary);
      setGoogleMapsUrl(locationToEdit.googleMapsUrl);
    } else {
      setName('');
      setAddress('');
      setCity('Namakkal');
      setState('Tamil Nadu');
      setPincode('637207');
      setType('Commercial Farm / Shed');
      setIsPrimary(false);
      setGoogleMapsUrl('');
    }
  }, [locationToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const item: BusinessLocationItem = {
      id: locationToEdit?.id || `loc-${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      city: city.trim() || 'Namakkal',
      state: state.trim() || 'Tamil Nadu',
      pincode: pincode.trim(),
      type,
      isPrimary,
      googleMapsUrl: googleMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(`${name} ${city}`)}`,
    };

    onSave(item);
    showToast(locationToEdit ? 'Location Updated' : 'Location Added', item.name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locationToEdit ? 'Edit Business Location' : 'Add Business Location'}
      description="Map a poultry shed facility, hatchery, feed mill, or administrative office"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {locationToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(locationToEdit.id);
                showToast('Location Removed', locationToEdit.name, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Location
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <Input
          label="Facility / Location Name *"
          placeholder="e.g. Central Broiler Farm & HQ (Sheds 1 & 2)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Location Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
          >
            <option value="Headquarters">Headquarters / Main Office</option>
            <option value="Commercial Farm / Shed">Commercial Farm / Shed</option>
            <option value="Hatchery">Hatchery & Nursery</option>
            <option value="Processing Facility">Processing Facility / Cold Store</option>
            <option value="Branch Office">Branch Office / Distribution Yard</option>
          </select>
        </div>

        <Input
          label="Street Address / Survey Number"
          placeholder="e.g. SF No. 248/2, Mohanur Road, Paramathi Velur Taluk"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="City / Taluk *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Input
            label="State *"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <Input
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>

        <Input
          label="Google Maps Direct Link"
          placeholder="https://maps.google.com/?q=..."
          value={googleMapsUrl}
          onChange={(e) => setGoogleMapsUrl(e.target.value)}
        />

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-[#F6FAFD] cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded border-slate-300 text-[#0f8f8c] focus:ring-[#0f8f8c]"
            />
            <div>
              <span>Mark as Primary Enterprise Location</span>
              <p className="text-[11px] text-slate-400 font-normal">
                Only one location can be marked primary. Setting this unsets any existing primary facility.
              </p>
            </div>
          </label>
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 5. ADD / EDIT TEAM MEMBER MODAL
// ============================================================

export interface AddEditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: TeamMemberItem | null;
  onSave: (item: TeamMemberItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditTeamMemberModal: React.FC<AddEditTeamMemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<TeamMemberItem['role']>('Farm Manager');

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setAvatarUrl(memberToEdit.avatarUrl);
      setDesignation(memberToEdit.designation);
      setEmail(memberToEdit.email);
      setPhone(memberToEdit.phone);
      setRole(memberToEdit.role);
    } else {
      setName('');
      setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
      setDesignation('');
      setEmail('');
      setPhone('+91 ');
      setRole('Farm Manager');
    }
  }, [memberToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const item: TeamMemberItem = {
      id: memberToEdit?.id || `tm-${Date.now()}`,
      name: name.trim(),
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      designation: designation.trim() || role,
      email: email.trim(),
      phone: phone.trim(),
      role,
    };

    onSave(item);
    showToast(memberToEdit ? 'Team Member Updated' : 'Team Member Added', item.name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={memberToEdit ? 'Edit Team Member' : 'Add Team Member'}
      description="List key farm personnel, supervisors, or technical consultants"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {memberToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(memberToEdit.id);
                showToast('Member Removed', memberToEdit.name, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Remove
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Member
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Users size={20} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Input
              label="Photo URL"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name *"
            placeholder="e.g. M. Selvakumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Designation *"
            placeholder="e.g. Shed Operations Supervisor"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Enterprise Role *
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
          >
            <option value="Founder / Owner">Founder / Owner</option>
            <option value="Farm Manager">Farm Manager</option>
            <option value="Technical Specialist">Technical Specialist</option>
            <option value="Veterinary Consultant">Veterinary Consultant</option>
            <option value="Supervisor">Shed Supervisor</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email"
            type="email"
            placeholder="member@..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone"
            placeholder="+91 ..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 6. ADD / EDIT BUSINESS CERTIFICATION MODAL
// ============================================================

export interface AddEditBusinessCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  certToEdit?: CertificationItem | null;
  onSave: (item: CertificationItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditBusinessCertModal: React.FC<AddEditBusinessCertModalProps> = ({
  isOpen,
  onClose,
  certToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credId, setCredId] = useState('');
  const [credUrl, setCredUrl] = useState('');

  useEffect(() => {
    if (certToEdit) {
      setName(certToEdit.name);
      setOrg(certToEdit.issuingOrganization);
      setIssueDate(certToEdit.issueDate);
      setExpiryDate(certToEdit.expiryDate);
      setCredId(certToEdit.credentialId);
      setCredUrl(certToEdit.credentialUrl);
    } else {
      setName('');
      setOrg('Bureau Veritas Quality Certification');
      setIssueDate('2022-09');
      setExpiryDate('2025-09');
      setCredId('BV-FSMS-IN-88912');
      setCredUrl('https://bureauveritas.com');
    }
  }, [certToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const item: CertificationItem = {
      id: certToEdit?.id || `bcert-${Date.now()}`,
      name: name.trim(),
      issuingOrganization: org.trim(),
      issueDate: issueDate.trim() || '2022',
      expiryDate: expiryDate.trim() || '2025',
      credentialId: credId.trim() || `CERT-${Date.now()}`,
      credentialUrl: credUrl.trim() || 'https://ptic-council.org',
    };

    onSave(item);
    showToast(certToEdit ? 'Certification Updated' : 'Certification Added', item.name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certToEdit ? 'Edit Business Accreditation' : 'Add Business Accreditation'}
      description="Attach ISO, TNPCB environmental clearance, FSSAI, or council certified badges"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {certToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(certToEdit.id);
                showToast('Accreditation Removed', certToEdit.name, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Accreditation
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <Input
          label="Certification / License Name *"
          placeholder="e.g. ISO 22000:2018 Food Safety Management in Poultry"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Issuing Body / Regulatory Authority *"
          placeholder="e.g. Bureau Veritas, TNPCB, FSSAI"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Issue Date"
            placeholder="e.g. 2022-09"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <Input
            label="Expiry Date"
            placeholder="e.g. 2025-09 or Permanent"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="License / Certificate ID"
            placeholder="e.g. BV-FSMS-IN-88912"
            value={credId}
            onChange={(e) => setCredId(e.target.value)}
          />
          <Input
            label="Verification Link or Doc URL"
            placeholder="https://..."
            value={credUrl}
            onChange={(e) => setCredUrl(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
