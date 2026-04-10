import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame, MapPin, Calendar, Clock, Users, Lock, Globe,
  ChevronLeft, Plus, X, Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const COVER_OPTIONS = [
  { emoji: '🥩', gradient: 'from-ember-red via-ember-orange to-ember-amber' },
  { emoji: '🌆', gradient: 'from-purple-900 via-ember-red to-ember-orange' },
  { emoji: '🌱', gradient: 'from-green-900 via-green-700 to-ember-amber' },
  { emoji: '🍗', gradient: 'from-yellow-800 via-ember-amber to-ember-gold' },
  { emoji: '🦐', gradient: 'from-orange-900 via-ember-orange to-ember-amber' },
  { emoji: '🌽', gradient: 'from-yellow-900 via-yellow-600 to-ember-gold' },
  { emoji: '🍖', gradient: 'from-red-900 via-ember-red to-ember-orange' },
  { emoji: '🔥', gradient: 'from-ember-bg via-ember-red to-ember-orange' },
];

const MENU_CATEGORIES = [
  { id: 'meat',    label: 'Meat',    icon: '🥩' },
  { id: 'veggie',  label: 'Veggie',  icon: '🥦' },
  { id: 'side',    label: 'Sides',   icon: '🥗' },
  { id: 'drink',   label: 'Drinks',  icon: '🍺' },
  { id: 'dessert', label: 'Dessert', icon: '🍨' },
];

const TAG_SUGGESTIONS = ['backyard', 'rooftop', 'family', 'vegan', 'smoke', 'charcoal', 'lakeside', 'weekend'];

interface MenuItemDraft {
  id: string;
  name: string;
  category: string;
}

export function CreateEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — basics
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(0);

  // Step 2 — time & location
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [maxGuests, setMaxGuests] = useState('20');
  const [isPublic, setIsPublic] = useState(true);

  // Step 3 — menu
  const [menuItems, setMenuItems] = useState<MenuItemDraft[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('meat');

  // Step 4 — tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const STEPS = ['Basics', 'Details', 'Menu', 'Review'];

  const addMenuItem = () => {
    if (!newItemName.trim()) return;
    setMenuItems(prev => [
      ...prev,
      { id: Math.random().toString(36).slice(2), name: newItemName.trim(), category: newItemCat },
    ]);
    setNewItemName('');
  };

  const removeMenuItem = (id: string) =>
    setMenuItems(prev => prev.filter(i => i.id !== id));

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const addCustomTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); }
    setTagInput('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    navigate('/events/e1');
  };

  const canNextStep1 = title.trim().length >= 3;
  const canNextStep2 = date && time && location.trim();

  return (
    <div className="min-h-screen bg-ember-bg pb-24 md:pb-8">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-glow-amber opacity-20" />
      </div>

      <div className="page-container relative z-10 pt-6 max-w-2xl">
        {/* Back */}
        <button
          onClick={() => step === 1 ? navigate('/events') : setStep(s => s - 1)}
          className="flex items-center gap-1.5 text-ember-muted hover:text-ember-cream transition-colors mb-6 text-sm"
        >
          <ChevronLeft size={16} />
          {step === 1 ? 'Back to events' : `Back to ${STEPS[step - 2]}`}
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-black text-ember-cream">
              {step === 1 && 'Set the vibe 🔥'}
              {step === 2 && 'Where & when?'}
              {step === 3 && 'Build the menu'}
              {step === 4 && 'Almost ready!'}
            </h1>
            <span className="text-ember-muted text-sm">{step}/{STEPS.length}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-ember-surface2 rounded-full overflow-hidden">
            <div
              className="h-full bg-fire-gradient rounded-full transition-all duration-500"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`text-xs font-medium transition-colors ${
                  i + 1 < step ? 'text-ember-orange' :
                  i + 1 === step ? 'text-ember-cream' :
                  'text-ember-subtle'
                }`}
              >
                {i + 1 < step && <Check size={10} className="inline mr-0.5" />}
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── Step 1: Basics ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* Cover selector */}
            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-3">Pick a cover</label>
              <div className="grid grid-cols-4 gap-2">
                {COVER_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCover(i)}
                    className={`relative h-20 rounded-xl bg-gradient-to-br ${opt.gradient}
                                flex items-center justify-center text-3xl transition-all duration-200
                                ${selectedCover === i ? 'ring-2 ring-ember-orange scale-105' : 'opacity-70 hover:opacity-100'}`}
                  >
                    {opt.emoji}
                    {selectedCover === i && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-ember-orange rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-2">
                Event title <span className="text-ember-orange">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sunday Smoke Session"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="ember-input text-lg font-semibold"
                maxLength={60}
              />
              <p className="text-ember-subtle text-xs mt-1 text-right">{title.length}/60</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-2">
                Tell people what to expect
              </label>
              <textarea
                placeholder="Low and slow. Bring your appetite. We'll handle the smoke..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="ember-input resize-none"
                rows={4}
                maxLength={400}
              />
              <p className="text-ember-subtle text-xs mt-1 text-right">{description.length}/400</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canNextStep1}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-ember-cream font-semibold text-sm mb-2">
                  <Calendar size={14} className="inline mr-1 text-ember-orange" />
                  Date <span className="text-ember-orange">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="ember-input"
                />
              </div>
              <div>
                <label className="block text-ember-cream font-semibold text-sm mb-2">
                  <Clock size={14} className="inline mr-1 text-ember-orange" />
                  Time <span className="text-ember-orange">*</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="ember-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-2">
                <MapPin size={14} className="inline mr-1 text-ember-orange" />
                Location name <span className="text-ember-orange">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jordan's Backyard"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="ember-input"
              />
            </div>

            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-2">
                Street address
              </label>
              <input
                type="text"
                placeholder="e.g. 14 Parkview Lane, Brooklyn"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="ember-input"
              />
            </div>

            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-2">
                <Users size={14} className="inline mr-1 text-ember-orange" />
                Max guests
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMaxGuests(v => String(Math.max(2, parseInt(v) - 1)))}
                  className="w-10 h-10 rounded-xl bg-ember-surface2 border border-ember-border text-ember-cream
                             hover:bg-ember-surface3 transition-colors flex items-center justify-center font-bold text-lg"
                >
                  −
                </button>
                <span className="text-ember-cream font-bold text-xl w-10 text-center">{maxGuests}</span>
                <button
                  onClick={() => setMaxGuests(v => String(Math.min(200, parseInt(v) + 1)))}
                  className="w-10 h-10 rounded-xl bg-ember-surface2 border border-ember-border text-ember-cream
                             hover:bg-ember-surface3 transition-colors flex items-center justify-center font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Privacy toggle */}
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isPublic
                  ? <Globe size={18} className="text-ember-green" />
                  : <Lock size={18} className="text-ember-muted" />}
                <div>
                  <p className="text-ember-cream font-semibold text-sm">
                    {isPublic ? 'Public event' : 'Private event'}
                  </p>
                  <p className="text-ember-muted text-xs">
                    {isPublic
                      ? 'Anyone can discover and request to join'
                      : 'Only people you invite can see this'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPublic(p => !p)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  isPublic ? 'bg-ember-green' : 'bg-ember-surface3'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                  isPublic ? 'left-6' : 'left-0.5'
                }`} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canNextStep2}
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* ── Step 3: Menu ── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-ember-muted text-sm">
              Add dishes to your menu. Guests can claim items so nothing gets doubled.
            </p>

            {/* Add item */}
            <div className="glass-card p-4 space-y-3">
              <input
                type="text"
                placeholder="Dish name, e.g. Smoked Brisket"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMenuItem()}
                className="ember-input"
              />
              <div className="flex gap-2 flex-wrap">
                {MENU_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewItemCat(cat.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                                transition-all duration-200 ${
                      newItemCat === cat.id
                        ? 'bg-ember-orange text-white'
                        : 'bg-ember-surface2 text-ember-muted border border-ember-border hover:border-ember-orange/40'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addMenuItem}
                disabled={!newItemName.trim()}>
                Add to menu
              </Button>
            </div>

            {/* Menu list */}
            {menuItems.length > 0 && (
              <div className="space-y-2">
                {MENU_CATEGORIES.map(cat => {
                  const items = menuItems.filter(i => i.category === cat.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <p className="text-ember-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
                        {cat.icon} {cat.label}
                      </p>
                      <div className="space-y-1.5">
                        {items.map(item => (
                          <div key={item.id}
                            className="flex items-center justify-between bg-ember-surface2 border border-ember-border
                                       px-3 py-2.5 rounded-xl">
                            <span className="text-ember-cream text-sm font-medium">{item.name}</span>
                            <button onClick={() => removeMenuItem(item.id)}
                              className="text-ember-subtle hover:text-red-400 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {menuItems.length === 0 && (
              <div className="text-center py-8 text-ember-subtle">
                <div className="text-3xl mb-2">🍽️</div>
                <p className="text-sm">No menu items yet</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="lg" fullWidth onClick={() => setStep(4)}>
                Skip for now
              </Button>
              <Button variant="primary" size="lg" fullWidth onClick={() => setStep(4)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            {/* Cover preview */}
            <div className={`h-40 rounded-2xl bg-gradient-to-br ${COVER_OPTIONS[selectedCover].gradient}
                             flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-ember-bg/60 to-transparent" />
              <span className="text-6xl relative z-10">{COVER_OPTIONS[selectedCover].emoji}</span>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div>
                <p className="text-ember-muted text-xs uppercase tracking-wider mb-1">Event</p>
                <p className="text-ember-cream font-bold text-xl">{title || 'Untitled BBQ'}</p>
                {description && <p className="text-ember-muted text-sm mt-1 line-clamp-2">{description}</p>}
              </div>

              {(date || time) && (
                <div className="flex gap-4">
                  {date && (
                    <div>
                      <p className="text-ember-muted text-xs uppercase tracking-wider mb-0.5">Date</p>
                      <p className="text-ember-cream font-semibold text-sm">{date}</p>
                    </div>
                  )}
                  {time && (
                    <div>
                      <p className="text-ember-muted text-xs uppercase tracking-wider mb-0.5">Time</p>
                      <p className="text-ember-cream font-semibold text-sm">{time}</p>
                    </div>
                  )}
                </div>
              )}

              {location && (
                <div>
                  <p className="text-ember-muted text-xs uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-ember-cream font-semibold text-sm flex items-center gap-1">
                    <MapPin size={12} className="text-ember-orange" /> {location}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Badge variant={isPublic ? 'green' : 'ghost'} icon={isPublic ? <Globe size={10}/> : <Lock size={10}/>}>
                  {isPublic ? 'Public' : 'Private'}
                </Badge>
                <Badge variant="orange" icon={<Users size={10}/>}>
                  {maxGuests} max guests
                </Badge>
                {menuItems.length > 0 && (
                  <Badge variant="amber">
                    {menuItems.length} menu items
                  </Badge>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-ember-cream font-semibold text-sm mb-2">Add tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TAG_SUGGESTIONS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                      tags.includes(tag)
                        ? 'bg-ember-orange text-white'
                        : 'bg-ember-surface2 text-ember-muted border border-ember-border'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Custom tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomTag()}
                  className="ember-input flex-1 text-sm"
                />
                <Button variant="secondary" size="md" onClick={addCustomTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleSubmit}
              icon={<Flame size={16} />}
            >
              {loading ? 'Lighting the fire...' : 'Publish BBQ'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
