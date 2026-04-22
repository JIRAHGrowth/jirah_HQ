'use client'

import { Mail, Phone, Star } from 'lucide-react'
import type { Contact } from '@/lib/detail'
import { formatDate } from '../../Primitives'

export default function ContactsSection({ contacts }: { contacts: Contact[] }) {
  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Contacts</h2>
        <button type="button" className="btn btn-ghost" disabled>
          + Add contact <span className="placeholder-pill">COMING SOON</span>
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className="muted" style={{ fontSize: 13 }}>No contacts recorded yet.</p>
      ) : (
        <div className="contacts-grid">
          {contacts.map((c, i) => (
            <div key={`${c.name}-${i}`} className="contact-card">
              <div className="contact-head">
                <div className="contact-name">
                  {c.name}
                  {c.primary && (
                    <span className="contact-primary-badge" title="Primary contact">
                      <Star size={10} strokeWidth={2} /> Primary
                    </span>
                  )}
                </div>
                {c.role && <div className="contact-role">{c.role}</div>}
              </div>
              <div className="contact-channels">
                {c.email && (
                  <a className="contact-link" href={`mailto:${c.email}`}>
                    <Mail size={12} strokeWidth={1.5} /> {c.email}
                  </a>
                )}
                {c.phone && (
                  <a className="contact-link" href={`tel:${c.phone}`}>
                    <Phone size={12} strokeWidth={1.5} /> {c.phone}
                  </a>
                )}
                {c.lastContactDate && (
                  <span className="muted contact-meta">
                    Last touch: {formatDate(c.lastContactDate)}
                  </span>
                )}
              </div>
              {c.notes && <div className="contact-notes">{c.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
