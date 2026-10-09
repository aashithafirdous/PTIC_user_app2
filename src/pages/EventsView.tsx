import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { MOCK_EVENTS, CURRENT_USER } from '../data/mockData';
import { PTICEvent, EventSpeaker } from '../types';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  Check, 
  Star, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  Lock, 
  Headphones, 
  X, 
  Building,
  Globe,
  MessageSquare,
  ChevronRight,
  Smartphone,
  Sparkles,
  BadgePercent,
  Hourglass,
  Eye,
  Heart,
  Compass
} from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '../components/ui/Toast';

import { slugify, resolveEventBySlugOrId, pushNav } from '../lib/router';
import { generateEventSchedulePdf } from '../lib/pdfScheduleGenerator';
import { ExhibitionHallView } from '../components/events/ExhibitionHallView';

type BookingFlowStep = 'details' | 'checkout' | 'processing' | 'success' | 'failed';
type PaymentTab = 'upi' | 'cards' | 'netbanking' | 'wallet';

interface ConfirmedBookingInfo {
  bookingId: string;
  event: PTICEvent;
  seatsCount: number;
  unitPrice: number;
  subtotal: number;
  convenienceFee: number;
  taxes: number;
  totalAmount: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  paymentMethod: string;
  bookedAt: string;
}

export const EventsView: React.FC = () => {
  const { showToast } = useToast();

  const [events, setEvents] = useState<PTICEvent[]>(() => MOCK_EVENTS);
  const [favouriteEventIds, setFavouriteEventIds] = useState<string[]>(['ev1', 'ev-past-1']);

  // Dynamic Past vs. Upcoming comparison based on event date
  const isPastEvent = (ev: PTICEvent): boolean => {
    if (ev.startDate) {
      const d = new Date(ev.startDate);
      if (!isNaN(d.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d.getTime() < today.getTime();
      }
    }
    const match = ev.date?.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (match) {
      const parsedDate = new Date(`${match[2]} ${match[1]}, ${match[3]}`);
      if (!isNaN(parsedDate.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parsedDate.getTime() < today.getTime();
      }
    }
    return false;
  };

  const toggleFavourite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favouriteEventIds.includes(id);
    if (isFav) {
      setFavouriteEventIds(favouriteEventIds.filter((favId) => favId !== id));
      showToast('Removed from favourites', undefined, 'info');
    } else {
      setFavouriteEventIds([...favouriteEventIds, id]);
      showToast('Saved to favourite events', undefined, 'success');
    }
  };

  const upcomingEvents = events.filter((ev) => !isPastEvent(ev));
  const pastEvents = events.filter((ev) => isPastEvent(ev));
  
  // Selected Event & Active Navigation Section
  const [selectedEvent, setSelectedEvent] = useState<PTICEvent | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isViewingHalls, setIsViewingHalls] = useState<boolean>(false);

  // Lightbox for Brochure/Flyer
  const [flyerLightboxEvent, setFlyerLightboxEvent] = useState<PTICEvent | null>(null);

  // Booking Flow Step
  const [bookingFlowStep, setBookingFlowStep] = useState<BookingFlowStep>('details');

  // Checkout Form Details
  const [attendeeName, setAttendeeName] = useState<string>(CURRENT_USER.name);
  const [attendeeEmail, setAttendeeEmail] = useState<string>('karthik.rajan@rajanpoultry.in');
  const [attendeePhone, setAttendeePhone] = useState<string>('9842154321');
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; phone?: string; terms?: string }>({});

  // Single Seat Selection
  const seatsCount = 1;

  // Payment Modal Visibility & State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedPaymentTab, setSelectedPaymentTab] = useState<PaymentTab>('upi');
  const [cardDigits, setCardDigits] = useState<string>('4532 8921 7340 6192');
  const [cardExp, setCardExp] = useState<string>('12/28');
  const [cardSecurityCode, setCardSecurityCode] = useState<string>('382');
  const [cardOwner, setCardOwner] = useState<string>(CURRENT_USER.name);
  const [selectedBankName, setSelectedBankName] = useState<string>('State Bank of India');

  // Confirmed Booking Record
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBookingInfo | null>(null);

  // Base numeric seat price (defaults to ₹1,499 matching image or parsed)
  const parseSeatPrice = (priceStr?: string): number => {
    if (!priceStr) return 1499;
    const clean = priceStr.replace(/,/g, '');
    const match = clean.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1499;
  };

  const currentSeatPrice = selectedEvent ? parseSeatPrice(selectedEvent.price) : 1499;
  const subtotal = currentSeatPrice * seatsCount;
  const convenienceFee = 101.53;
  const totalAmount = subtotal + convenienceFee;

  // Real QR Code Data URL generation
  const [realQrDataUrl, setRealQrDataUrl] = useState<string>('');

  useEffect(() => {
    const upiPayload = `upi://pay?pa=ptic.council@icici&pn=Poultry%20Technology%20and%20Innovation%20Council&am=${totalAmount.toFixed(2)}&cu=INR&tn=PTIC%20Summit%20Registration`;
    QRCode.toDataURL(upiPayload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#14253d',
        light: '#ffffff'
      }
    })
      .then((url) => setRealQrDataUrl(url))
      .catch((err) => console.error('Error generating real QR code:', err));
  }, [totalAmount]);

  // URL deep-linking support (/events/:slug or ?id=)
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const segments = pathname.split('/').filter(Boolean);
      let eventSlug: string | undefined;

      if (segments[0] === 'events' && segments[1]) {
        eventSlug = segments[1];
      }

      const params = new URLSearchParams(window.location.search);
      const eventId = params.get('id');

      const toResolve = eventSlug || eventId;
      if (toResolve) {
        const found = resolveEventBySlugOrId(toResolve, MOCK_EVENTS);
        if (found) {
          setSelectedEvent(found);
          const isRegister = params.get('register') === 'true' || segments[2] === 'register';
          if (isRegister) {
            setBookingFlowStep('checkout');
          } else {
            setBookingFlowStep('details');
          }
          return;
        }
      }

      if (segments.length <= 1 && !eventId) {
        setSelectedEvent(null);
        setBookingFlowStep('details');
        setIsPaymentModalOpen(false);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('ptic-navigate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('ptic-navigate', handleUrlChange);
    };
  }, []);

  // Scrollspy effect for sticky event navigation tabs
  useEffect(() => {
    if (!selectedEvent || bookingFlowStep !== 'details') return;

    const handleScroll = () => {
      const sectionIds = ['overview', 'agenda', 'speakers', 'sponsors', 'expo', 'location'];
      const scrollPosition = window.scrollY + 145;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      setActiveSection('overview');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedEvent, bookingFlowStep]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 125;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  // Open Event Details View
  const handleOpenEventDetails = (ev: PTICEvent) => {
    setActiveSection('overview');
    setSelectedEvent(ev);
    setBookingFlowStep('details');
    setIsPaymentModalOpen(false);
    pushNav(`/events/${slugify(ev.title)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close Event Details View
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setBookingFlowStep('details');
    setIsPaymentModalOpen(false);
    pushNav('/events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Checkout directly
  const handleStartBooking = (ev: PTICEvent) => {
    setSelectedEvent(ev);
    setBookingFlowStep('checkout');
    setIsPaymentModalOpen(false);
    setFormErrors({});
    pushNav(`/events/${slugify(ev.title)}?register=true`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share Event link
  const handleShareEvent = (ev: PTICEvent) => {
    const shareUrl = `${window.location.origin}/events/${slugify(ev.title)}`;
    if (navigator.share) {
      navigator.share({
        title: ev.title,
        text: `${ev.title} — ${ev.category}`,
        url: shareUrl,
      }).catch(() => {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast('Event Link Copied', `Shareable link for "${ev.title}" copied to clipboard.`, 'success');
    }
  };

  // Toggle Interested
  const handleToggleInterested = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isNowInterested = !ev.isInterested;
          const newCount = isNowInterested ? ev.interestedCount + 1 : Math.max(0, ev.interestedCount - 1);
          showToast(
            isNowInterested ? 'Marked as Interested' : 'Removed from Interested',
            ev.title,
            'info'
          );
          const updated = { ...ev, isInterested: isNowInterested, interestedCount: newCount };
          if (selectedEvent && selectedEvent.id === eventId) {
            setSelectedEvent(updated);
          }
          return updated;
        }
        return ev;
      })
    );
  };

  // Download Agenda PDF (Professional PTIC-Branded PDF Schedule)
  const handleDownloadAgenda = (ev: PTICEvent) => {
    try {
      generateEventSchedulePdf(ev);
      showToast('Official Schedule Downloaded', `PTIC-branded PDF schedule for "${ev.title}" generated.`, 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Download Initiated', `${ev.title}_Agenda.pdf`, 'info');
    }
  };

  // Validate form & Trigger Payment Modal
  const handleTriggerPaymentModal = () => {
    const errors: { name?: string; email?: string; phone?: string; terms?: string } = {};

    if (!attendeeName.trim()) {
      errors.name = 'Please enter your name.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!attendeeEmail.trim() || !emailPattern.test(attendeeEmail.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const phoneClean = attendeePhone.replace(/\D/g, '');
    if (!attendeePhone.trim() || phoneClean.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!agreeTerms) {
      errors.terms = 'Please accept the Terms & Conditions to proceed.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsPaymentModalOpen(true);
  };

  // Finalize Payment from Modal
  const handleExecutePayment = () => {
    if (!selectedEvent) return;

    setIsPaymentModalOpen(false);
    setBookingFlowStep('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const generatedBookingId = `PTIC-${Math.floor(100000 + Math.random() * 900000)}`;
      const bookingRecord: ConfirmedBookingInfo = {
        bookingId: generatedBookingId,
        event: selectedEvent,
        seatsCount,
        unitPrice: currentSeatPrice,
        subtotal,
        convenienceFee,
        taxes: 0,
        totalAmount,
        attendeeName: attendeeName.trim() || CURRENT_USER.name,
        attendeeEmail: attendeeEmail.trim() || 'karthik.rajan@rajanpoultry.in',
        attendeePhone: attendeePhone.trim() || '+91 98421 54321',
        paymentMethod: selectedPaymentTab.toUpperCase(),
        bookedAt: new Date().toISOString()
      };

      setConfirmedBooking(bookingRecord);

      // Mark event as registered
      const updatedEv: PTICEvent = {
        ...selectedEvent,
        isAttending: true,
        attendeesCount: selectedEvent.attendeesCount + seatsCount
      };

      setSelectedEvent(updatedEv);
      setEvents((prev) => prev.map((ev) => (ev.id === selectedEvent.id ? updatedEv : ev)));

      setBookingFlowStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Payment Successful', `Booking ${generatedBookingId} confirmed.`, 'success');
    }, 1600);
  };

  // Add to Calendar (.ics download)
  const handleAddToCalendar = (ev: PTICEvent) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PTIC//Poultry Innovation Summit//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description}`,
      `LOCATION:${ev.venueAddress || ev.location}`,
      'DTSTART:20261018T043000Z',
      'DTEND:20261018T113000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar Invite Saved', 'Event added to your calendar file.', 'success');
  };

  // Download Receipt / Tax Invoice
  const handleDownloadReceipt = (record: ConfirmedBookingInfo | null) => {
    if (!record) return;

    const receiptContent = `
======================================================
POULTRY TECHNOLOGY & INNOVATION COUNCIL (PTIC)
OFFICIAL EVENT BOOKING RECEIPT & ENTRY PASS
======================================================
Booking Reference: ${record.bookingId}
Date of Issue: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
Payment Status: SUCCESSFUL (PAID)

EVENT DETAILS:
Event: ${record.event.title}
Date: ${record.event.date}
Time: ${record.event.timeRange || '10:00 AM – 5:00 PM'}
Venue: ${record.event.venueAddress || record.event.location}
Organized By: ${record.event.organizer || 'Poultry Technology & Innovation Council'}

ATTENDEE DETAILS:
Delegate Name: ${record.attendeeName}
Email: ${record.attendeeEmail}
Contact Phone: ${record.attendeePhone}

SEATS & PRICING:
Seats Reserved: ${record.seatsCount} ${record.seatsCount === 1 ? 'Seat' : 'Seats'}
Seat Price: ₹${record.unitPrice.toLocaleString('en-IN')} × ${record.seatsCount}
Subtotal: ₹${record.subtotal.toLocaleString('en-IN')}
Convenience Fees: ₹${record.convenienceFee.toFixed(2)}
------------------------------------------------------
TOTAL AMOUNT PAID: ₹${record.totalAmount.toFixed(2)}
Payment Mode: ${record.paymentMethod}
Gateway Authorization: RBI/PTIC-AUTH-${Math.floor(1000000 + Math.random() * 9000000)}
======================================================
Please display this digital receipt or QR pass at the
registration desk for physical badge printing.
Support Desk: support@poultrytech.in | +91 98421 54321
======================================================
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PTIC_Receipt_${record.bookingId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Receipt Downloaded', `Official receipt saved for booking #${record.bookingId}.`, 'success');
  };

  // ----------------------------------------------------------------------------------
  // 1. PAYMENT PROCESSING STATE
  // ----------------------------------------------------------------------------------
  if (selectedEvent && bookingFlowStep === 'processing') {
    return (
      <div className="mx-auto max-w-[560px] py-16 px-4 text-center animate-fadeIn font-metropolis">
        <div className="bg-white dark:bg-[#153451] rounded-3xl border border-slate-200/90 dark:border-[#294966] p-8 sm:p-12 shadow-xs space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-[#135E69]/20 border-t-[#135E69] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock size={18} className="text-[#135E69]" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#F6FAFD] font-display">
              Processing your payment…
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#B3CFE5]">
              Please don't close or refresh this page.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#294966] space-y-2 text-xs text-slate-500 dark:text-[#B3CFE5]">
            <p className="flex items-center justify-center gap-1.5 font-semibold text-[#135E69] dark:text-[#4A7FA7]">
              <ShieldCheck size={15} />
              <span>Connecting securely with banking gateway…</span>
            </p>
            <p>Authorizing ₹{totalAmount.toFixed(2)} for {seatsCount} {seatsCount === 1 ? 'seat' : 'seats'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // 2. PAYMENT SUCCESS STATE
  // ----------------------------------------------------------------------------------
  if (selectedEvent && bookingFlowStep === 'success') {
    const bookingId = confirmedBooking?.bookingId || 'PTIC-782194';

    return (
      <div className="mx-auto max-w-[820px] py-8 px-4 text-left animate-fadeIn font-metropolis">
        <div className="bg-white dark:bg-[#153451] rounded-3xl border border-slate-200/90 dark:border-[#294966] p-6 sm:p-10 shadow-xs space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-200/90 dark:border-[#294966]">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Confirmed
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-[#B3CFE5]">
                  #{bookingId}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F6FAFD] tracking-tight font-display mt-1">
                Booking Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                Your delegate seat has been officially reserved for {selectedEvent.title}.
              </p>
            </div>
          </div>

          {/* Ticket Card with QR Code */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-[#102640] dark:to-[#153451] border border-slate-200/90 dark:border-[#294966] flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 p-3 bg-white rounded-xl shadow-xs border border-slate-200/80">
              {realQrDataUrl ? (
                <img src={realQrDataUrl} alt="Digital QR Pass" className="w-32 h-32 block" />
              ) : (
                <div className="w-32 h-32 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 text-xs w-full">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200/80 dark:border-[#294966]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#B3CFE5]">Event</p>
                  <p className="font-bold text-slate-900 dark:text-[#F6FAFD] text-sm mt-0.5 truncate">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#B3CFE5]">Date & Time</p>
                  <p className="font-bold text-slate-900 dark:text-[#F6FAFD] text-sm mt-0.5">{selectedEvent.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#B3CFE5]">Delegate</p>
                  <p className="font-bold text-slate-900 dark:text-[#F6FAFD] mt-0.5">{attendeeName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#B3CFE5]">Seats Reserved</p>
                  <p className="font-bold text-slate-900 dark:text-[#F6FAFD] mt-0.5">{seatsCount} Delegate {seatsCount === 1 ? 'Pass' : 'Passes'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#B3CFE5]">Amount Paid</p>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setBookingFlowStep('details');
                pushNav(`/events/${slugify(selectedEvent.title)}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 min-w-[160px] h-[50px] rounded-xl font-semibold text-sm text-white bg-[#135E69] hover:bg-[#0e4851] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye size={16} />
              <span>View Event Details</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddToCalendar(selectedEvent)}
              className="flex-1 min-w-[160px] h-[50px] rounded-xl font-semibold text-sm text-slate-800 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] hover:bg-slate-50 dark:hover:bg-[#1A3D63] border border-slate-200 dark:border-[#294966] transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar size={16} className="text-[#135E69] dark:text-[#4A7FA7]" />
              <span>Add to Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadReceipt(confirmedBooking)}
              className="flex-1 min-w-[160px] h-[50px] rounded-xl font-semibold text-sm text-slate-800 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] hover:bg-slate-50 dark:hover:bg-[#1A3D63] border border-slate-200 dark:border-[#294966] transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={16} className="text-[#135E69] dark:text-[#4A7FA7]" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // 3. REGISTRATION / CHECKOUT PAGE (Clean 2-Column Layout - Image 2 Style)
  // ----------------------------------------------------------------------------------
  if (selectedEvent && bookingFlowStep === 'checkout') {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-3 sm:px-6 py-6 text-left space-y-6 animate-fadeIn font-metropolis">
        {/* Two-Column Responsive Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-1">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Booking Confirmation Form (Image 2 Style)                   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F6FAFD] font-display">
                Booking Confirmation
              </h2>

              <div className="space-y-4">
                {/* Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1.5">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={(e) => {
                        setAttendeeName(e.target.value);
                        if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                      }}
                      placeholder="Name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ptic-primary/20 focus:border-ptic-primary transition-all ${
                        formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-[#294966]'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1.5">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => {
                        setAttendeeEmail(e.target.value);
                        if (formErrors.email) setFormErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="example@gmail.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ptic-primary/20 focus:border-ptic-primary transition-all ${
                        formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-[#294966]'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mobile Number with India Flag & WhatsApp Icon */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1.5">
                    <span>Mobile Number</span>
                    <MessageSquare size={13} className="text-emerald-500 fill-emerald-500/20" />
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-300 dark:border-[#294966] overflow-hidden bg-white dark:bg-[#102640] focus-within:ring-2 focus-within:ring-ptic-primary/20 focus-within:border-ptic-primary">
                    <div className="flex items-center gap-1 px-3 py-2.5 bg-slate-50 dark:bg-[#153451] border-r border-slate-200 dark:border-[#294966] text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] shrink-0 select-none">
                      <span className="text-base leading-none">🇮🇳</span>
                      <span className="text-[10px] text-slate-400">▾</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={attendeePhone}
                      onChange={(e) => {
                        setAttendeePhone(e.target.value);
                        if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      placeholder="9842154321"
                      className="w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle size={13} /> {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Checkboxes (Image 2 Style) */}
                <div className="space-y-2.5 pt-3 text-xs text-slate-600 dark:text-[#B3CFE5]">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-ptic-primary focus:ring-ptic-primary cursor-pointer"
                    />
                    <span>Create an account to manage booking</span>
                  </label>

                  <div>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (formErrors.terms) setFormErrors((p) => ({ ...p, terms: undefined }));
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-ptic-primary focus:ring-ptic-primary cursor-pointer"
                      />
                      <span>
                        By continuing, you agree to{' '}
                        <a href="#terms" onClick={(e) => e.preventDefault()} className="font-semibold text-ptic-primary dark:text-[#4A7FA7] hover:underline">
                          Terms & Conditions
                        </a>
                      </span>
                    </label>
                    {formErrors.terms && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium pl-6">
                        <AlertCircle size={13} /> {formErrors.terms}
                      </p>
                    )}
                  </div>
                </div>

                {/* Confirm & Pay Button (Pill Button - Image 2 Style) */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleTriggerPaymentModal}
                    className="px-8 py-3.5 rounded-full font-bold text-sm text-white bg-ptic-primary hover:bg-ptic-dark transition-all shadow-subtle hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm & Pay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Event Summary & Fee Breakdown (Image 2 Style)               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 sm:p-6 space-y-4 shadow-xs">
              
              {/* Event Cover Flyer Banner */}
              <div className="w-full aspect-[2.4/1] rounded-xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-[#294966]">
                {selectedEvent.flyerUrl ? (
                  <img
                    src={selectedEvent.flyerUrl}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-ptic-dark via-ptic-primary to-ptic-secondary flex items-center justify-center text-white font-bold p-4 text-center">
                    {selectedEvent.title}
                  </div>
                )}
              </div>

              {/* Event Meta Details */}
              <div className="space-y-2 pt-1 text-left">
                <h3 className="font-extrabold text-slate-900 dark:text-[#F6FAFD] text-base sm:text-lg leading-snug font-display">
                  {selectedEvent.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-[#B3CFE5]">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{selectedEvent.venueAddress || selectedEvent.location}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-600 shrink-0" />
                    <span>{selectedEvent.date}, {selectedEvent.timeRange || '9:00 AM'}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Ticket size={14} className="text-amber-600 shrink-0" />
                    <span>{seatsCount} {seatsCount === 1 ? 'Ticket' : 'Tickets'}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-[#294966]" />

              {/* Line Items Table (Image 2 Style) */}
              <div className="space-y-3 text-xs text-left">
                <div className="flex items-center justify-between text-slate-400 font-medium text-[11px]">
                  <span>Ticket Name</span>
                  <span>Price & Quantity</span>
                </div>

                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-[#F6FAFD]">
                  <span>DELEGATE PASS</span>
                  <span>₹ {currentSeatPrice.toLocaleString('en-IN')} x {seatsCount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-500 dark:text-[#B3CFE5] text-[11px]">
                  <span className="flex items-center gap-1">
                    <span>Includes convenience fees</span>
                    <span className="text-[10px] text-slate-400">ⓘ</span>
                  </span>
                  <span>₹ {convenienceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-[#294966]" />

              {/* Total Row (Image 2 Style) */}
              <div className="flex items-baseline justify-between py-1 text-left">
                <span className="font-bold text-base text-slate-900 dark:text-[#F6FAFD]">Total</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F6FAFD] font-sans">
                  ₹ {totalAmount.toFixed(2)}
                </span>
              </div>

              {/* 3 Trust Badges Row (Image 2 Style) */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-[#294966] text-center">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-[#B3CFE5] leading-tight">
                    100% Secure<br />Payment
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Users size={18} className="text-rose-500" />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-[#B3CFE5] leading-tight">
                    Trusted<br />By event-goers
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Headphones size={18} className="text-sky-600" />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-[#B3CFE5] leading-tight">
                    Support<br />Available
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAYMENT MODAL (Image 1 Style - Razorpay/Ticket9 in PTIC Theme)            */}
        {/* ========================================================================= */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-metropolis">
            <div className="relative w-full max-w-4xl bg-white dark:bg-[#153451] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200 dark:border-[#294966] max-h-[92vh]">
              
              {/* Left Panel: Razorpay/Ticket9 Brand & Price Summary */}
              <div className="w-full md:w-72 bg-gradient-to-br from-[#14253d] via-[#102640] to-[#0f8f8c] p-6 text-white flex flex-col justify-between shrink-0 relative overflow-hidden text-left">
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg">
                      <span className="text-white">ticket</span>
                      <span className="w-5 h-5 rounded-full bg-white text-[#14253d] flex items-center justify-center text-xs font-black">9</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-white/90 border border-white/20">
                      <ShieldCheck size={11} className="text-emerald-400" />
                      <span>Razorpay Trusted Business</span>
                    </span>
                  </div>

                  {/* Price Summary Card */}
                  <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-md">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Price Summary</p>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans mt-0.5">
                      ₹{totalAmount.toFixed(2)}
                    </div>
                  </div>

                  {/* Using as phone pill */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-xs flex items-center justify-between border border-white/15">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-emerald-300" />
                      <span className="text-white/90 font-medium">Using as +91 {attendeePhone || '98421 54321'}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/60" />
                  </div>

                  {/* Offers pill */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-xs flex items-center justify-between border border-white/15">
                    <div className="flex items-center gap-2">
                      <BadgePercent size={14} className="text-amber-300" />
                      <span className="text-white/90 font-medium truncate">Offers on Card, UPI and...</span>
                    </div>
                    <ChevronRight size={14} className="text-white/60 shrink-0" />
                  </div>
                </div>

                <div className="pt-6 relative z-10 flex items-center gap-1.5 text-xs text-white/70">
                  <span>Secured by</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Lock size={12} className="text-emerald-400" /> Razorpay
                  </span>
                </div>
              </div>

              {/* Right Panel: Payment Options Tabs & View */}
              <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#153451] text-left">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-[#294966] flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F6FAFD]">
                    Payment Options
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-[#F6FAFD] hover:bg-slate-100 dark:hover:bg-[#102640] transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Body: Left Tabs + Right Content */}
                <div className="flex flex-col sm:flex-row flex-1 overflow-y-auto">
                  {/* Left Tabs List */}
                  <div className="w-full sm:w-56 p-3 space-y-1.5 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-[#294966] bg-slate-50/50 dark:bg-[#102640]/50 shrink-0">
                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('upi')}
                      className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer ${
                        selectedPaymentTab === 'upi'
                          ? 'bg-white dark:bg-[#153451] shadow-xs border border-slate-200 dark:border-[#294966]'
                          : 'hover:bg-white/60 dark:hover:bg-[#153451]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">UPI</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                          3 Offers
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                        <span>GPay</span> · <span>PhonePe</span> · <span>Paytm</span>
                      </div>
                    </button>

                    {/* Cards */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('cards')}
                      className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer ${
                        selectedPaymentTab === 'cards'
                          ? 'bg-white dark:bg-[#153451] shadow-xs border border-slate-200 dark:border-[#294966]'
                          : 'hover:bg-white/60 dark:hover:bg-[#153451]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">Cards</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 truncate max-w-[90px]">
                          Earn 10%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                        <span>Visa</span> · <span>Master</span> · <span>RuPay</span>
                      </div>
                    </button>

                    {/* Netbanking */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('netbanking')}
                      className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer ${
                        selectedPaymentTab === 'netbanking'
                          ? 'bg-white dark:bg-[#153451] shadow-xs border border-slate-200 dark:border-[#294966]'
                          : 'hover:bg-white/60 dark:hover:bg-[#153451]/60'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">Netbanking</span>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                        <span>SBI</span> · <span>HDFC</span> · <span>ICICI</span>
                      </div>
                    </button>

                    {/* Wallet */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('wallet')}
                      className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer ${
                        selectedPaymentTab === 'wallet'
                          ? 'bg-white dark:bg-[#153451] shadow-xs border border-slate-200 dark:border-[#294966]'
                          : 'hover:bg-white/60 dark:hover:bg-[#153451]/60'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">Wallet</span>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                        <span>Amazon</span> · <span>PhonePe</span>
                      </div>
                    </button>
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 p-5 space-y-4">
                    {/* Offers Banner */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-[#102640] dark:to-[#153451] border border-rose-100 dark:border-[#294966] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Sparkles size={16} className="text-rose-500 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-[#F6FAFD] truncate">
                          Upto 5% NeuCoins on Tata Neu UPI
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                        +1 View all
                      </span>
                    </div>

                    {/* UPI TAB CONTENT */}
                    {selectedPaymentTab === 'upi' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">UPI QR</span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-[#B3CFE5] flex items-center gap-1">
                            <Hourglass size={13} className="text-slate-400" />
                            <span>09:16</span>
                          </span>
                        </div>

                        {/* QR Box Container */}
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#294966] bg-slate-50/60 dark:bg-[#102640]/60 flex flex-col items-center justify-center space-y-3">
                          <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                            {realQrDataUrl ? (
                              <img src={realQrDataUrl} alt="UPI QR Code" className="w-40 h-40 block" />
                            ) : (
                              <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                                Generating QR...
                              </div>
                            )}
                          </div>

                          <div className="text-center space-y-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                              Scan the QR using any UPI App
                            </p>
                            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-[#B3CFE5]">
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] font-bold text-slate-700 dark:text-[#F6FAFD]">GPay</span>
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] font-bold text-purple-600">PhonePe</span>
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] font-bold text-sky-600">Paytm</span>
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] font-bold text-slate-900 dark:text-white">CRED</span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                            3 Offers Available
                          </span>
                        </div>

                        {/* Pay Button / ID fallback */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={handleExecutePayment}
                            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-ptic-primary hover:bg-ptic-dark transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 size={16} />
                            <span>Simulate Successful Payment</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CARDS TAB CONTENT */}
                    {selectedPaymentTab === 'cards' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardDigits}
                            onChange={(e) => setCardDigits(e.target.value)}
                            placeholder="4532 8921 7340 6192"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#294966] text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] font-mono focus:outline-none focus:ring-2 focus:ring-ptic-primary/20 focus:border-ptic-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              placeholder="12/28"
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#294966] text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] font-mono focus:outline-none focus:ring-2 focus:ring-ptic-primary/20 focus:border-ptic-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardSecurityCode}
                              onChange={(e) => setCardSecurityCode(e.target.value)}
                              placeholder="382"
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#294966] text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] font-mono focus:outline-none focus:ring-2 focus:ring-ptic-primary/20 focus:border-ptic-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1">Name on Card</label>
                          <input
                            type="text"
                            value={cardOwner}
                            onChange={(e) => setCardOwner(e.target.value)}
                            placeholder="Cardholder Name"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#294966] text-sm text-slate-900 dark:text-[#F6FAFD] bg-white dark:bg-[#102640] focus:outline-none focus:ring-2 focus:ring-ptic-primary/20 focus:border-ptic-primary"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleExecutePayment}
                          className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-white bg-ptic-primary hover:bg-ptic-dark transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Lock size={15} />
                          <span>Pay ₹{totalAmount.toFixed(2)}</span>
                        </button>
                      </div>
                    )}

                    {/* NETBANKING TAB CONTENT */}
                    {selectedPaymentTab === 'netbanking' && (
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] mb-1">Select Bank</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setSelectedBankName(b)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                                selectedBankName === b
                                  ? 'border-[#0f8f8c] bg-[#0f8f8c]/10 text-slate-900 dark:text-[#F6FAFD] font-bold'
                                  : 'border-slate-200 dark:border-[#294966] hover:bg-slate-50 dark:hover:bg-[#102640] text-slate-700 dark:text-[#B3CFE5]'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleExecutePayment}
                          className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-white bg-ptic-primary hover:bg-ptic-dark transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Lock size={15} />
                          <span>Pay with {selectedBankName}</span>
                        </button>
                      </div>
                    )}

                    {/* WALLET TAB CONTENT */}
                    {selectedPaymentTab === 'wallet' && (
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] text-xs space-y-2">
                          <p className="font-semibold text-slate-900 dark:text-[#F6FAFD]">Available Wallets</p>
                          <div className="flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] font-bold">Paytm</span>
                            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] font-bold">PhonePe</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleExecutePayment}
                          className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-white bg-ptic-primary hover:bg-ptic-dark transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Lock size={15} />
                          <span>Pay with Wallet</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#102640] border-t border-slate-100 dark:border-[#294966] text-[11px] text-slate-500 dark:text-[#B3CFE5] text-center">
                  By proceeding, I agree to Razorpay's <span className="font-semibold text-slate-700 dark:text-white">Privacy Notice</span> • <span className="font-semibold text-slate-700 dark:text-white">Edit Preferences</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // 3.5 EXHIBITION HALLS VIEW (Dedicated Hall Listing & Interactive Stalls)
  // ----------------------------------------------------------------------------------
  if (selectedEvent && isViewingHalls) {
    return (
      <div className="w-full max-w-[95%] lg:max-w-[94%] xl:max-w-[94%] 2xl:max-w-[93%] mx-auto px-1 sm:px-2 pt-1 pb-10 text-left">
        <ExhibitionHallView
          onBackToEvent={() => setIsViewingHalls(false)}
          eventTitle={selectedEvent.title}
        />
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // 4. EVENT DETAILS VIEW (Clean & Premium Conference Page)
  // ----------------------------------------------------------------------------------
  if (selectedEvent) {
    const defaultOrganizer = selectedEvent.organizer || 'Poultry Technology & Innovation Council (PTIC)';
    const defaultVenueAddress = selectedEvent.venueAddress || selectedEvent.location;
    const defaultTimeRange = selectedEvent.timeRange || '10:00 AM – 5:00 PM';
    const defaultWhoShouldAttend = selectedEvent.whoShouldAttend || [
      'Commercial Broiler & Layer Farm Owners & Supervisors',
      'Avian Pathologists, Field Veterinarians & Diagnostic Lab Heads',
      'Hatchery Production Managers & Incubation Specialists',
      'Feed Millers, Nutritionists & Quality Control Technologists',
      'Poultry Shed Automation & Environmental Equipment Engineers',
      'Contract Farming Integrator Executives & Technical Officers'
    ];

    const fallbackSpeakers: EventSpeaker[] = [
      {
        id: 'spk-def1',
        name: 'Dr. Arun Kumar',
        role: 'Senior Poultry Veterinarian',
        organization: 'VetCare Poultry Services',
        avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=350&h=350&q=80',
        bio: '20+ years clinical poultry experience specializing in respiratory diagnostics, gut health, and biosecurity protocols.',
        specialties: ['Avian Pathology', 'Vaccine Protocols', 'Biosecurity']
      },
      {
        id: 'spk-def2',
        name: 'Dr. Meenakshi Sundaram',
        role: 'Avian Nutrition Scientist',
        organization: 'TANUVAS Poultry Research',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Leading research on alternative feed proteins, gut microbiome stabilization, and summer heat stress mitigation.',
        specialties: ['Alternative Feed', 'Heat Stress', 'Gut Microbiome']
      },
      {
        id: 'spk-def3',
        name: 'Priya Subramaniam',
        role: 'Founder & CEO',
        organization: 'AgriTech Solutions',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Developing low-cost IoT ambient monitoring, acoustic flock monitoring, and automated climate systems for broiler sheds.',
        specialties: ['IoT Sensors', 'AI Flock Analytics', 'Smart Ventilation']
      },
      {
        id: 'spk-def4',
        name: 'Rajesh Murugan',
        role: 'Director of Operations',
        organization: 'Srinivasa Poultry Integrations',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Directing commercial broiler contract farming operations across 12 Namakkal zones.',
        specialties: ['Contract Farming', 'Farm Scale']
      },
      {
        id: 'spk-def5',
        name: 'Suresh Chenniappan',
        role: 'Commercial Layer Farmer',
        organization: 'Kongu Egg Farms',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Leading commercial layer egg production with 450,000 birds telemetry installation.',
        specialties: ['Layer Production', 'Telemetry']
      },
      {
        id: 'spk-def6',
        name: 'Dr. Kavitha Ramasamy',
        role: 'Vaccine Development Lead',
        organization: 'Bharat Biotech Avian Labs',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813511-20a845187747?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Specialist in early chick viral immunity and low-temperature aerosol vaccination.',
        specialties: ['Vaccinology', 'Biosecurity']
      },
      {
        id: 'spk-def7',
        name: 'Anandakrishnan V',
        role: 'Senior Automation Engineer',
        organization: 'Namakkal Shed Robotics',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Expert in high-pressure misting lines, foggers, and tunnel ventilation automation.',
        specialties: ['Robotics', 'Climate Automation']
      },
      {
        id: 'spk-def8',
        name: 'Deepa Narayanan',
        role: 'Quality & Biosecurity Officer',
        organization: 'National Egg Bureau',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&h=350&q=80',
        bio: 'Formulating egg safety, grading protocols, and Salmonella prevention benchmarks.',
        specialties: ['Quality Control', 'Food Safety']
      }
    ];

    const speakersList = selectedEvent.speakers && selectedEvent.speakers.length >= 6 
      ? selectedEvent.speakers 
      : fallbackSpeakers;

    return (
      <div className="w-full max-w-full px-0 sm:px-1 space-y-5 text-left animate-fadeIn">
        {/* ========================================================================= */}
        {/* DESKTOP TWO-COLUMN STRUCTURE: ~75% Left Column | ~25% Right Column        */}
        {/* Both columns begin at the same vertical position beneath the header      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full pt-1">
          
          {/* ========================================================================= */}
          {/* LEFT 75% COLUMN: Flyer -> Metadata -> Sticky Nav -> Content Sections     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6 min-w-0">

            {/* 4.1 TOP SECTION: Landscape Hero Banner (16 / 7 Aspect Ratio) */}
            <div className="event-hero-banner rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#294966] bg-slate-900 shadow-xs select-none group">
              {/* Bookmark & Share Buttons on Right Top Corner of Flyer */}
              <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleInterested(e, selectedEvent.id)}
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-800 dark:text-white shadow-md backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
                  title={selectedEvent.isInterested ? 'Bookmarked' : 'Bookmark Event'}
                  aria-label="Bookmark event"
                >
                  <Star size={17} className={selectedEvent.isInterested ? 'fill-amber-500 text-amber-500' : ''} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareEvent(selectedEvent);
                  }}
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-800 dark:text-white shadow-md backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
                  title="Share Event"
                  aria-label="Share event"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Minimal Back Button on Left Top Corner of Flyer */}
              <button
                type="button"
                onClick={handleBackToEvents}
                className="absolute top-3.5 left-3.5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-800 dark:text-white shadow-md backdrop-blur-sm text-xs font-semibold transition-all hover:scale-105 cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
                title="Back to Events"
                aria-label="Back to events"
              >
                <ArrowLeft size={14} />
                <span>Events</span>
              </button>

              {selectedEvent.flyerUrl ? (
                <button
                  type="button"
                  onClick={() => setFlyerLightboxEvent(selectedEvent)}
                  className="block w-full h-full cursor-pointer group focus:outline-none p-0 m-0 border-0 bg-transparent text-left"
                  aria-label={`Open flyer for ${selectedEvent.title}`}
                  title="Click to view event flyer"
                >
                  <img
                    src={selectedEvent.flyerUrl}
                    alt={selectedEvent.title}
                    className="event-hero-img transition-transform duration-300 group-hover:scale-[1.01]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-r from-[#14253d] via-[#135E69] to-[#0f8f8c] items-center justify-center p-8 text-center text-white">
                    <div>
                      <Calendar size={48} className="mx-auto text-emerald-400 opacity-80 mb-2" />
                      <h2 className="text-2xl font-bold font-display">{selectedEvent.title}</h2>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#14253d] via-[#135E69] to-[#0f8f8c] flex items-center justify-center p-8 text-center text-white">
                  <div className="space-y-2">
                    <Calendar size={48} className="mx-auto text-emerald-400 opacity-80 mb-2" />
                    <h2 className="text-2xl font-bold font-display">{selectedEvent.title}</h2>
                  </div>
                </div>
              )}
            </div>

            {/* 5. EVENT METADATA BELOW THE FLYER */}
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#B3CFE5] border border-[#135E69]/20 dark:border-[#4A7FA7]/30">
                  {selectedEvent.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966]">
                  {selectedEvent.mode}
                </span>
                {selectedEvent.featured && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Featured Summit
                  </span>
                )}
                {selectedEvent.isAttending && (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs flex items-center gap-1.5 ml-auto">
                    <Check size={13} /> Registered Delegate
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F6FAFD] tracking-tight font-display leading-tight">
                {selectedEvent.title}
              </h1>

              {/* Compact 3-Item Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 border-t border-slate-100 dark:border-[#294966]">
                {/* 1. Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-[#102640] text-[#135E69] dark:text-[#4A7FA7] flex items-center justify-center shrink-0 border border-sky-100 dark:border-[#294966]">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-400 dark:text-[#B3CFE5]/70 text-[10px] uppercase tracking-wider">Date & Time</p>
                    <p className="font-bold text-slate-900 dark:text-[#F6FAFD] text-sm mt-0.5">{selectedEvent.date}</p>
                    <p className="text-slate-500 dark:text-[#B3CFE5] text-xs truncate">{defaultTimeRange}</p>
                  </div>
                </div>

                {/* 2. Place */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#102640] text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-[#294966]">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-400 dark:text-[#B3CFE5]/70 text-[10px] uppercase tracking-wider">Place</p>
                    <p className="font-bold text-slate-900 dark:text-[#F6FAFD] text-sm mt-0.5 truncate">{selectedEvent.location}</p>
                    <p className="text-slate-500 dark:text-[#B3CFE5] text-xs truncate" title={defaultVenueAddress}>
                      {defaultVenueAddress}
                    </p>
                  </div>
                </div>

                {/* 3. Organised By */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-[#102640] text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-[#294966]">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-400 dark:text-[#B3CFE5]/70 text-[10px] uppercase tracking-wider">Organised By</p>
                    <p className="font-bold text-slate-900 dark:text-[#F6FAFD] text-sm mt-0.5 truncate" title={defaultOrganizer}>
                      {defaultOrganizer}
                    </p>
                    <p className="text-slate-500 dark:text-[#B3CFE5] text-xs">Council Verified Initiative</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. STICKY EVENT SECTION NAVIGATION */}
            <div className="sticky top-[60px] z-20 bg-white/95 dark:bg-[#102640]/95 backdrop-blur-md border border-slate-200/90 dark:border-[#294966] rounded-2xl shadow-xs p-1.5 sm:p-2 transition-all">
              <nav
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2 w-full text-xs font-semibold select-none"
                aria-label="Event sections navigation"
              >
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'agenda', label: 'Official Agenda' },
                  { id: 'speakers', label: 'Speakers' },
                  { id: 'sponsors', label: 'Sponsors & Exhibitors' },
                  { id: 'expo', label: 'Conference & Expo' },
                  { id: 'location', label: 'Location Base' },
                ].map((tab) => {
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => scrollToSection(tab.id)}
                      className={`w-full py-2.5 px-1 sm:px-2 text-center truncate rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[#135E69] dark:bg-[#4A7FA7] text-white shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-[#B3CFE5] hover:text-slate-900 dark:hover:text-[#F6FAFD] hover:bg-slate-100 dark:hover:bg-[#1A3D63] font-medium'
                      }`}
                      title={tab.label}
                    >
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* 7. EVENT INFORMATION SECTIONS */}
            
            {/* 7.1 OVERVIEW SECTION */}
            <div id="overview" className="space-y-6 scroll-mt-[135px]">
              {/* About the Event */}
              <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-3">
                <h2 className="text-sm font-bold text-[#135E69] dark:text-[#4A7FA7] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#294966]">
                  <FileText size={17} className="text-[#135E69] dark:text-[#4A7FA7]" />
                  <span>About the Event</span>
                </h2>
                <div className="text-sm text-slate-700 dark:text-[#F6FAFD] leading-relaxed space-y-3">
                  <p>{selectedEvent.description}</p>
                  <p className="text-xs text-slate-500 dark:text-[#B3CFE5] leading-relaxed">
                    Organized under the flagship initiative of the Poultry Technology & Innovation Council (PTIC) to bridge the technology divide for commercial poultry shed operators, veterinarians, and academic researchers.
                  </p>
                </div>
              </div>

              {/* Summit Highlights */}
              {selectedEvent.features && selectedEvent.features.length > 0 && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-4">
                  <h2 className="text-sm font-bold text-[#135E69] dark:text-[#4A7FA7] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#294966]">
                    <Star size={17} className="text-[#135E69] dark:text-[#4A7FA7]" />
                    <span>Summit Highlights & Inclusions</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEvent.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966]">
                        <CheckCircle2 size={16} className="text-[#135E69] dark:text-[#4A7FA7] shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-800 dark:text-[#F6FAFD]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Who Should Attend */}
              <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-4">
                <h2 className="text-sm font-bold text-[#135E69] dark:text-[#4A7FA7] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#294966]">
                  <Users size={17} className="text-[#135E69] dark:text-[#4A7FA7]" />
                  <span>Who Should Attend</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {defaultWhoShouldAttend.map((target, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966]">
                      <CheckCircle2 size={16} className="text-[#135E69] dark:text-[#4A7FA7] shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-800 dark:text-[#F6FAFD]">{target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7.2 AGENDA SECTION */}
            <div id="agenda" className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-4 scroll-mt-[135px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
                <h2 className="text-base font-bold text-[#135E69] dark:text-[#4A7FA7] uppercase tracking-wider flex items-center gap-2">
                  <Clock size={18} className="text-[#135E69] dark:text-[#4A7FA7]" />
                  <span>Event Sessions & Schedule</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadAgenda(selectedEvent)}
                  leftIcon={<Download size={14} />}
                >
                  Download Schedule
                </Button>
              </div>

              {selectedEvent.agendaItems && selectedEvent.agendaItems.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-[#294966]">
                  {selectedEvent.agendaItems.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-[#102640] text-[#135E69] dark:text-[#4A7FA7] border border-slate-200/60 dark:border-[#294966] shrink-0">
                          {item.time}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F6FAFD] leading-snug">
                            {item.topic}
                          </h4>
                          {item.speaker && (
                            <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                              Speaker: <span className="font-semibold text-slate-700 dark:text-[#F6FAFD]">{item.speaker}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-[#B3CFE5] uppercase tracking-wider shrink-0 sm:text-right">
                        Session {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5]">Program agenda schedule will be published shortly.</p>
              )}
            </div>

            {/* 7.3 SPEAKERS SECTION (Layout matched to uploaded Image 2 "Our People" using PTIC Brand Colors) */}
            <div id="speakers" className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 sm:p-8 space-y-6 scroll-mt-[135px]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#135E69] dark:text-[#5ce0d2] block">
                  KEYNOTE FACULTY & SCIENTISTS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display mt-0.5">
                  Our People
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1">
                  Distinguished veterinary clinicians, animal nutritionists, and poultry automation pioneers
                </p>
              </div>

              {/* 4-Column Grid matching uploaded Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 pt-2">
                {speakersList.map((spk, idx) => {
                  // Alternating organic blob shapes
                  const blobShapes = [
                    'rounded-[35%_65%_60%_40%/50%_40%_60%_50%]',
                    'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
                    'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]',
                    'rounded-[50%_50%_40%_60%/40%_60%_50%_50%]',
                  ];
                  const currentBlob = blobShapes[idx % blobShapes.length];

                  return (
                    <div
                      key={spk.id}
                      className="flex flex-col items-center text-center group cursor-pointer"
                    >
                      {/* Organic Blob Backdrop in PTIC Brand Teal (NOT Purple) */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <div
                          className={`absolute inset-0 bg-gradient-to-tr from-[#135E69] via-[#0f8f8c] to-[#16697a] dark:from-[#135E69] dark:to-[#1A5A66] ${currentBlob} transition-transform duration-300 group-hover:scale-105 shadow-md`}
                        />
                        <img
                          src={spk.avatarUrl}
                          alt={spk.name}
                          className="relative z-10 w-28 h-28 object-cover rounded-full shadow-lg ring-3 ring-white dark:ring-[#153451] transition-transform duration-300 group-hover:scale-108"
                        />
                      </div>

                      {/* Text Information: Role above, Bold Name, Email/Org below */}
                      <div className="mt-4 space-y-0.5 w-full px-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#135E69] dark:text-[#5ce0d2] truncate">
                          {spk.role}
                        </p>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                          {spk.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] truncate">
                          {spk.organization}
                        </p>
                        <p className="text-[11px] font-medium text-[#135E69]/80 dark:text-[#5ce0d2]/80 truncate">
                          {spk.name.toLowerCase().replace(/[^a-z]/g, '')}@ptic.council.in
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7.4 SPONSORS & EXHIBITORS SECTION (Layout matched to uploaded Image 3 - Clean 3-Column Logo Grid) */}
            <div id="sponsors" className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 sm:p-8 space-y-6 scroll-mt-[135px]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#135E69] dark:text-[#5ce0d2] block">
                  PARTNERS & SPONSORS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display mt-0.5">
                  Industry Leadership & Sponsors
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1">
                  Supported by premier poultry technology enterprises, research universities & council federations
                </p>
              </div>

              {/* Clean 3-Column Grid matching uploaded Image 3 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-8 pt-2">
                {[
                  { id: 'sp1', name: 'VetCare', full: 'VetCare Pharmaceuticals', tier: 'Platinum Sponsor', color: '#135E69', badge: 'VC' },
                  { id: 'sp2', name: 'AgriTech IoT', full: 'AgriTech Automation Systems', tier: 'Summit Host', color: '#0f8f8c', badge: 'AT' },
                  { id: 'sp3', name: 'TNPF', full: 'Tamil Nadu Poultry Federation', tier: 'Federation Partner', color: '#0284c7', badge: 'PF' },
                  { id: 'sp4', name: 'Kongu Eggs', full: 'Kongu Automation & Hatcheries', tier: 'Gold Sponsor', color: '#d97706', badge: 'KE' },
                  { id: 'sp5', name: 'BioVet Labs', full: 'BioVet Probiotics & Nutrition', tier: 'Research Partner', color: '#16a34a', badge: 'BV' },
                  { id: 'sp6', name: 'Namakkal Forum', full: 'Namakkal Layer Farmers Forum', tier: 'Council Affiliate', color: '#9333ea', badge: 'NF' },
                  { id: 'sp7', name: 'CARI India', full: 'Central Avian Research Institute', tier: 'Institutional Partner', color: '#dc2626', badge: 'CA' },
                  { id: 'sp8', name: 'TANUVAS Tech', full: 'TANUVAS Innovation Directorate', tier: 'Knowledge Partner', color: '#0d9488', badge: 'TV' },
                  { id: 'sp9', name: 'IPEC India', full: 'Indian Poultry Equipment Council', tier: 'Associate Sponsor', color: '#2563eb', badge: 'IP' },
                ].map((sp) => (
                  <div
                    key={sp.id}
                    className="h-28 sm:h-32 rounded-2xl bg-slate-50/70 dark:bg-[#102640]/70 hover:bg-white dark:hover:bg-[#153451] border border-slate-200/90 dark:border-[#294966] hover:border-[#135E69]/40 p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-2xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: sp.color }}
                      >
                        {sp.badge}
                      </div>
                      <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display">
                        {sp.name}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-[#B3CFE5] mt-1.5 truncate max-w-[90%]">
                      {sp.full}
                    </p>
                    <span className="text-[10px] font-bold text-[#135E69] dark:text-[#5ce0d2] mt-0.5">
                      {sp.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7.5 CONFERENCE & EXPO SECTION */}
            <div id="expo" className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-5 scroll-mt-[135px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-[#294966]">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display">
                    Conference & Expo
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                    Explore live equipment displays, farm automation booths & diagnostic stalls
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewingHalls(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-white bg-[#135E69] hover:bg-[#0e4850] shadow-2xs hover:shadow transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>VIEW HALLS</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {(selectedEvent.exhibitors && selectedEvent.exhibitors.length > 0 ? selectedEvent.exhibitors : [
                  { id: 'ex1', name: 'Kongu Automation Solutions', booth: 'Hall A · Stall 12', category: 'Climate & Sensors' },
                  { id: 'ex2', name: 'BioVet Probiotics', booth: 'Hall B · Stall 04', category: 'Feed Additives' },
                  { id: 'ex3', name: 'AgriTech Solutions', booth: 'Hall A · Stall 18', category: 'IoT Shed Automation' },
                ]).map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                        {ex.booth || 'Pavilion Booth'}
                      </span>
                      <Building size={14} className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-[#F6FAFD] text-sm">{ex.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] mt-0.5">{ex.category || 'Exhibition Showcase'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7.6 LOCATION SECTION (Two-column: Left Google Maps, Right Venue info) */}
            <div id="location" className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-5 scroll-mt-[135px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
                <h2 className="text-base font-bold text-[#135E69] dark:text-[#4A7FA7] uppercase tracking-wider flex items-center gap-2">
                  <Compass size={17} className="text-[#135E69] dark:text-[#4A7FA7]" />
                  <span>Venue & Navigation Map</span>
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(defaultVenueAddress)}`, '_blank')}
                  rightIcon={<ExternalLink size={13} />}
                >
                  Get Directions
                </Button>
              </div>

              {/* Two-Column Grid: Map on Left, Venue Info on Right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Left Half: Google Maps Embed */}
                <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden border border-slate-200 dark:border-[#294966] bg-slate-100 dark:bg-[#102640]">
                  <iframe
                    title="Event Location Google Map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(defaultVenueAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="eager"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Right Half: Venue Information */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]">
                        Official Venue
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-[#F6FAFD] mt-0.5">
                        {selectedEvent.location}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-[#B3CFE5] mt-1 leading-relaxed">
                        {defaultVenueAddress}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-[#294966] space-y-1.5 text-xs text-slate-600 dark:text-[#B3CFE5]">
                      <p className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#135E69] dark:text-[#4A7FA7] shrink-0" />
                        <span>Chennai Trade Centre, Hall 1 & 2</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Compass size={13} className="text-[#135E69] dark:text-[#4A7FA7] shrink-0" />
                        <span>GPS: 13.0076° N, 80.1878° E</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-[#294966] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-[#B3CFE5]">
                      Free delegate parking available
                    </span>
                    <button
                      type="button"
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(defaultVenueAddress)}`, '_blank')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#135E69] dark:text-[#4A7FA7] hover:underline cursor-pointer"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7.7 REMAINING SECTIONS: Guidelines & Cancellation Terms */}
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#135E69] dark:text-[#4A7FA7] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#294966]">
                <AlertCircle size={17} className="text-[#135E69] dark:text-[#4A7FA7]" />
                <span>Things to Know & Cancellation Policy</span>
              </h2>

              <div className="space-y-3 text-xs text-slate-700 dark:text-[#F6FAFD] leading-relaxed">
                {selectedEvent.guidelines && selectedEvent.guidelines.map((guide, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#135E69] dark:bg-[#4A7FA7] shrink-0 mt-1.5" />
                    <span>{guide}</span>
                  </div>
                ))}
                
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] space-y-1.5 text-xs mt-3">
                  <p className="font-bold text-slate-900 dark:text-[#F6FAFD]">Official Cancellation & Refund Terms</p>
                  <p className="text-slate-600 dark:text-[#B3CFE5]">
                    Cancellations made up to 72 hours before the session start will receive a 100% refund processed back to the original council payment mode. Contact the PTIC event desk for group transfers or delegate substitution requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT 25% COLUMN: STICKY BOOKING CARD (Simple & Clean - Image 3 Style)    */}
          {/* Begins at the top alongside the flyer & remains sticky throughout scroll */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-4 xl:col-span-3 min-w-0 relative h-full">
            <div className="sticky top-[76px] space-y-4">
              
              {/* Main Clean Booking Card */}
              <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-card p-5 sm:p-6 space-y-4 text-left">
                
                {/* Meta Rows with Clean Icons (Image 3 Style) */}
                <div className="space-y-3.5 text-xs text-slate-700 dark:text-[#F6FAFD]">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-slate-600 dark:text-[#B3CFE5] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-800 dark:text-[#F6FAFD] leading-tight text-sm">
                      {selectedEvent.date}
                    </span>
                  </div>

                  {/* Duration / Hours */}
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-slate-600 dark:text-[#B3CFE5] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 dark:text-[#F6FAFD] leading-tight">
                      {defaultTimeRange}
                    </span>
                  </div>

                  {/* Age / Stakeholders */}
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-slate-600 dark:text-[#B3CFE5] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 dark:text-[#F6FAFD] leading-tight">
                      All Stakeholders & Students (18+ yrs)
                    </span>
                  </div>

                  {/* Language */}
                  <div className="flex items-start gap-3">
                    <Globe size={18} className="text-slate-600 dark:text-[#B3CFE5] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 dark:text-[#F6FAFD] leading-tight">
                      English & Tamil
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-3">
                    <Building size={18} className="text-slate-600 dark:text-[#B3CFE5] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 dark:text-[#F6FAFD] leading-tight">
                      {selectedEvent.category} · {selectedEvent.mode}
                    </span>
                  </div>

                  {/* Venue / Location with Maps link */}
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-slate-600 dark:text-[#B3CFE5] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-[#F6FAFD] leading-tight">
                        {selectedEvent.location}
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(defaultVenueAddress)}`, '_blank')}
                        className="text-xs text-[#0f8f8c] dark:text-[#4A7FA7] hover:underline inline-flex items-center gap-1 font-semibold mt-1 cursor-pointer"
                      >
                        <span>View on Maps</span>
                        <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="border-t border-slate-100 dark:border-[#294966]" />

                {/* Filling Fast Notice Pill (Image 3 Style) */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                  <AlertCircle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-medium">Bookings are filling fast for Chennai</span>
                </div>

                {/* Bottom Row: Price + Book Now Button (Image 3 Style) */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-[#F6FAFD] font-display leading-tight">
                      ₹{currentSeatPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-[#B3CFE5]">onwards</span>
                    </div>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                      Filling Fast
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedEvent.isAttending) {
                        setBookingFlowStep('success');
                      } else {
                        handleStartBooking(selectedEvent);
                      }
                    }}
                    className={`py-3 px-6 rounded-xl font-bold text-sm text-white transition-all shadow-subtle hover:shadow flex items-center justify-center gap-2 cursor-pointer ${
                      selectedEvent.isAttending
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-ptic-primary hover:bg-ptic-dark'
                    }`}
                  >
                    {selectedEvent.isAttending ? (
                      <>
                        <Check size={16} />
                        <span>View Pass</span>
                      </>
                    ) : (
                      <span>Book Now</span>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </aside>
        </div>

        {/* Flyer Lightbox Modal */}
        {flyerLightboxEvent && (
          <Modal
            isOpen={!!flyerLightboxEvent}
            onClose={() => setFlyerLightboxEvent(null)}
            title={flyerLightboxEvent.title}
            description="Official Event Brochure"
            maxWidth="xl"
            footer={
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    showToast('Brochure Saved', `Saved ${flyerLightboxEvent.flyerName || 'Brochure'}`, 'success');
                  }}
                  leftIcon={<Download size={14} />}
                >
                  Save Brochure
                </Button>
                <Button variant="primary" size="sm" onClick={() => setFlyerLightboxEvent(null)}>
                  Close
                </Button>
              </div>
            }
          >
            <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl overflow-hidden">
              <img
                src={flyerLightboxEvent.flyerUrl}
                alt={flyerLightboxEvent.title}
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </Modal>
        )}

        {/* Mobile Convenient Sticky Bottom Booking Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-[#102640]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#294966] shadow-lg flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#B3CFE5]">Delegate Ticket</p>
            <p className="text-base font-extrabold text-[#111827] dark:text-[#F6FAFD]">
              ₹{currentSeatPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (selectedEvent.isAttending) {
                setBookingFlowStep('success');
              } else {
                handleStartBooking(selectedEvent);
              }
            }}
            className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#135E69] hover:bg-[#0e4850] shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Ticket size={14} />
            <span>{selectedEvent.isAttending ? 'View Pass' : 'Book Now'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Helper to render consistent event cards
  const renderEventCard = (ev: PTICEvent, isPast: boolean) => {
    const isFav = favouriteEventIds.includes(ev.id);
    return (
      <div
        key={ev.id}
        onClick={() => handleOpenEventDetails(ev)}
        className="group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#153451] hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
      >
        {/* Poster Image */}
        <div className="relative w-full aspect-[3.2/4] bg-slate-900 overflow-hidden">
          {ev.flyerUrl ? (
            <img
              src={ev.flyerUrl}
              alt={ev.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#14253d] to-[#135E69] flex items-center justify-center p-4 text-center text-white">
              <span className="font-bold text-xs">{ev.title}</span>
            </div>
          )}

          {/* Favourite / Heart Button on top left */}
          <button
            type="button"
            onClick={(e) => toggleFavourite(ev.id, e)}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10 cursor-pointer"
            title={isFav ? 'Remove favourite' : 'Add to favourites'}
          >
            <Heart size={14} className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'} />
          </button>

          {/* Status Badge on top right */}
          <div className="absolute top-2 right-2">
            {isPast ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-slate-300">
                Completed
              </span>
            ) : ev.isAttending ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs flex items-center gap-0.5">
                <Check size={11} /> Registered
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#135E69]/90 backdrop-blur-xs text-white">
                {ev.mode || 'Upcoming'}
              </span>
            )}
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-3 sm:p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Title with Blue Checkmark Badge */}
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-slate-900 dark:text-[#F6FAFD] text-xs sm:text-sm line-clamp-1 leading-snug">
                {ev.title}
              </h4>
              <CheckCircle2 size={14} className="text-[#0284c7] fill-[#0284c7] text-white shrink-0" />
            </div>

            {/* Location */}
            <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-[#B3CFE5] mt-1">
              <MapPin size={12} className="text-rose-500 shrink-0" />
              <span className="truncate">{ev.location}</span>
            </p>
          </div>

          {/* Date & Paid Badge Row */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-[#294966] text-[11px]">
            <span className="flex items-center gap-1 text-slate-600 dark:text-[#B3CFE5] font-medium">
              <Calendar size={12} className="text-[#135E69] dark:text-[#5ce0d2]" />
              <span className="truncate">{ev.date.split(',')[0]}</span>
            </span>
            <span className={`font-bold ${isPast ? 'text-slate-500' : 'text-slate-800 dark:text-[#F6FAFD]'}`}>
              {isPast ? 'Concluded' : ev.price ? 'Paid' : 'Free'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // 5. MAIN EVENTS DIRECTORY / LISTING VIEW (/events)
  // ----------------------------------------------------------------------------------
  return (
    <div className="space-y-8 sm:space-y-12 w-full max-w-[1536px] mx-auto text-left font-metropolis animate-fadeIn pt-2">
      {/* 1. UPCOMING EVENTS SECTION */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#294966]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F6FAFD] tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
              Live summits, technical conferences, and hands-on poultry workshops
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2]">
            {upcomingEvents.length} Events
          </span>
        </div>

        {upcomingEvents.length === 0 ? (
          <EmptyState
            title="No upcoming events scheduled"
            description="Check back soon for upcoming summits and workshops."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5">
            {upcomingEvents.map((ev) => renderEventCard(ev, false))}
          </div>
        )}
      </section>

      {/* SUFFICIENT, INTENTIONAL VERTICAL GAP BETWEEN UPCOMING AND PAST EVENTS */}
      <div className="my-10 sm:my-14 border-t border-slate-200/60 dark:border-[#294966]/60" />

      {/* 2. PAST EVENTS SECTION */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#294966]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F6FAFD] tracking-tight">
              Past Events
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
              Archived conclaves, diagnostic seminars, and past council expos
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-[#102640] dark:text-[#B3CFE5]">
            {pastEvents.length} Concluded
          </span>
        </div>

        {pastEvents.length === 0 ? (
          <EmptyState
            title="No past events found"
            description="Completed council events will be automatically archived here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5">
            {pastEvents.map((ev) => renderEventCard(ev, true))}
          </div>
        )}
      </section>

      {/* Full Flyer / Brochure Lightbox Modal */}
      {flyerLightboxEvent && (
        <Modal
          isOpen={!!flyerLightboxEvent}
          onClose={() => setFlyerLightboxEvent(null)}
          title={`Event Flyer: ${flyerLightboxEvent.title}`}
          description={`Official Brochure · ${flyerLightboxEvent.date} · ${flyerLightboxEvent.location}`}
          maxWidth="lg"
          footer={
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-mono">
                {flyerLightboxEvent.flyerName || 'PTIC_Official_Flyer.jpg'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast('Downloading Event Brochure', flyerLightboxEvent.flyerName || 'Brochure.jpg', 'success')}
                  leftIcon={<Download size={13} />}
                >
                  Download Flyer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const ev = flyerLightboxEvent;
                    setFlyerLightboxEvent(null);
                    handleOpenEventDetails(ev);
                  }}
                >
                  View Event Details
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-3 text-left">
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#294966] bg-slate-900 flex items-center justify-center max-h-[65vh]">
              {flyerLightboxEvent.flyerUrl ? (
                <img
                  src={flyerLightboxEvent.flyerUrl}
                  alt={flyerLightboxEvent.title}
                  className="w-full h-auto max-h-[65vh] object-contain"
                />
              ) : (
                <div className="p-12 text-center text-white/70 text-sm">
                  Brochure graphic currently in council publication
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
