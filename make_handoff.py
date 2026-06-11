#!/usr/bin/env python3
"""
JFSN Archive — Allison Handoff PDF Generator
Run: python3 make_handoff.py
Output: JFSN-Archive-Handoff-Allison.pdf
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor

import os, re, sys

def _load_ftp_creds():
    """Read FTP credentials from .ftp.env — never hardcode them in this file.
    This script lives in a public GitHub repo; the generated PDF is print-only."""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.ftp.env')
    creds = {}
    try:
        for line in open(env_path):
            m = re.match(r'\s*(FTP_USER|FTP_PASS)\s*=\s*["\']?([^"\'\n]+)', line)
            if m:
                creds[m.group(1)] = m.group(2)
    except FileNotFoundError:
        sys.exit("ERROR: .ftp.env not found — cannot embed FTP credentials in the handoff PDF.")
    if 'FTP_USER' not in creds or 'FTP_PASS' not in creds:
        sys.exit("ERROR: FTP_USER/FTP_PASS missing from .ftp.env.")
    return creds

_FTP = _load_ftp_creds()

W, H = letter  # 612 x 792

# Light system — matches jfsn.com redesign
BG      = HexColor('#FCF9F3')   # bone-white
INK     = HexColor('#0B0B0B')   # deep-ink
ORANGE  = HexColor('#FF6600')   # international-orange
GRAY    = HexColor('#575757')   # archive-gray
DIVIDER = HexColor('#0B0B0B')   # 1px rule

# Keep aliases for compatibility
BLACK = INK
CREAM = BG

TITLE_FONT  = 'Times-Roman'
TITLE_BOLD  = 'Times-Bold'
LABEL_FONT  = 'Helvetica'
LABEL_BOLD  = 'Helvetica-Bold'

OUT = 'JFSN-Archive-Handoff-Allison.pdf'
DATE = 'JUNE 2026'

def bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def label(c, text, x, y, size=7, color=GRAY):
    c.setFont(LABEL_BOLD, size)
    c.setFillColor(color)
    c.drawString(x, y, text.upper())

def value(c, text, x, y, size=10, color=INK, font=LABEL_FONT):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, text)

def divider(c, x, y, w, weight=0.5):
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(weight)
    c.line(x, y, x + w, y)

def cred_row(c, key, val, x, y, col_w=180):
    label(c, key, x, y, size=7, color=GRAY)
    value(c, val, x + col_w, y, size=9.5, color=INK)

def section_head(c, num, title, x, y):
    c.setFont(LABEL_BOLD, 7)
    c.setFillColor(ORANGE)
    c.drawString(x, y, str(num))
    c.setFont(TITLE_BOLD, 13)
    c.setFillColor(INK)
    c.drawString(x + 14, y, title)

def done_badge(c, x, y):
    c.setFillColor(ORANGE)
    c.roundRect(x, y - 2, 42, 13, 2, fill=1, stroke=0)
    c.setFont(LABEL_BOLD, 6.5)
    c.setFillColor(BG)
    c.drawCentredString(x + 21, y + 2.5, 'DONE')

def note(c, text, x, y, width=460, size=8.5, color=GRAY):
    c.setFont(LABEL_FONT, size)
    c.setFillColor(color)
    # simple word-wrap
    words = text.split()
    line = ''
    line_h = size * 1.5
    cy = y
    for w in words:
        test = (line + ' ' + w).strip()
        if c.stringWidth(test, LABEL_FONT, size) < width:
            line = test
        else:
            c.drawString(x, cy, line)
            cy -= line_h
            line = w
    if line:
        c.drawString(x, cy, line)
    return cy - line_h


# ── PAGE 1: Cover + Section 1 ──────────────────────────────────────────────

def page1(c):
    bg(c)
    mx = 56  # left margin

    # ── Orange rule top ──
    c.setFillColor(ORANGE)
    c.rect(mx, H - 44, W - mx*2, 2, fill=1, stroke=0)

    # ── JFSN wordmark ──
    c.setFont(TITLE_BOLD, 28)
    c.setFillColor(INK)
    c.drawString(mx, H - 82, 'JFSN')

    c.setFont(TITLE_FONT, 11)
    c.setFillColor(GRAY)
    c.drawString(mx, H - 98, 'Archive')

    # ── "For Allison" dedication ──
    c.setFont(TITLE_FONT, 36)
    c.setFillColor(INK)
    c.drawString(mx, H - 150, 'For Allison')

    # ── Sub-headline ──
    c.setFont(LABEL_FONT, 8.5)
    c.setFillColor(GRAY)
    c.drawString(mx, H - 172,
        'Everything you need to care for the archive and digital accounts.')
    c.drawString(mx, H - 185,
        'Keep it somewhere safe — print a fresh copy any time credentials change.')

    # ── Reprint / Date bar ──
    c.setFont(LABEL_BOLD, 7)
    c.setFillColor(ORANGE)
    c.drawString(mx, H - 210, 'REPRINT AFTER ANY CREDENTIAL CHANGE')
    c.setFillColor(GRAY)
    c.drawRightString(W - mx, H - 210, f'LAST UPDATED {DATE}')

    divider(c, mx, H - 218, W - mx*2)

    # ── Section 1: Art Archive ──
    y = H - 248
    section_head(c, 1, 'THE ART ARCHIVE — JFSN.COM', mx, y)

    y -= 28
    rows = [
        ('Website',          'jfsn.com'),
        ('Hosting company',  'HostGator'),
        ('Account email',    'jfsneumann@gmail.com'),
        ('FTP username',     _FTP['FTP_USER']),
        ('FTP password',     _FTP['FTP_PASS']),
        ('GitHub',           'github.com/JFSNeumann/jfsn-archive'),
        ('Code on Mac',      '/Users/jeffreyneumann/Documents/JFSN/'),
        ('HostGator support','1-866-96-GATOR'),
        ('Domain registrar', 'Gandi — held by Jeff’s friend (name: ___________) — renews each March 5'),
        ('Cloud backup',     'Backblaze B2, bucket jfsn-archive — login jfsneumann@gmail.com (pw in Bitwarden)'),
        ('Mirror site',      'jfsn-archive.netlify.app — Netlify login in Bitwarden'),
        ('Recovery guide',   'docs/CUSTODIAN-RECOVERY-PLAN.md (in the code folder and on GitHub)'),
    ]
    for key, val in rows:
        divider(c, mx, y + 12, W - mx*2)
        cred_row(c, key, val, mx, y, col_w=170)
        y -= 24

    divider(c, mx, y + 12, W - mx*2)

    y -= 18
    c.setFont(LABEL_BOLD, 7.5)
    c.setFillColor(INK)
    c.drawString(mx, y, 'If the site goes down:')
    c.setFont(LABEL_FONT, 7.5)
    c.setFillColor(GRAY)
    c.drawString(mx + 102, y,
        'Call HostGator at 1-866-96-GATOR. Verify the account via jfsneumann@gmail.com.')

    y -= 14
    c.setFont(LABEL_BOLD, 7.5)
    c.setFillColor(INK)
    c.drawString(mx, y, 'To keep it running:')
    c.setFont(LABEL_FONT, 7.5)
    c.setFillColor(GRAY)
    c.drawString(mx + 102, y,
        'Pay the HostGator bill, and make sure jfsn.com is renewed every March 5 — the domain is the one thing money can’t recover late.')

    # ── Footer page number ──
    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawCentredString(W / 2, 32, '1')


# ── PAGE 2: Apple + Google + Bitwarden ─────────────────────────────────────

def page2(c):
    bg(c)
    mx = 56
    y = H - 56

    # ── Section 2: Apple ──
    section_head(c, 2, 'APPLE — iPHONE, iPad & MAC', mx, y)
    done_badge(c, W - mx - 42, y)

    y -= 18
    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawString(mx, y, f'Done — {DATE[:4].capitalize()} 2026. Allison is set as Legacy Contact on the Apple ID. She holds the access key in her iPhone.')

    y -= 14
    note_text = ("Apple’s Digital Legacy gives Allison full access after Jeff passes — "
                 "iCloud photos, notes, messages, files, and all connected devices.")
    note(c, note_text, mx, y, width=480)

    y -= 28
    bullets = [
        'When the time comes: go to apple.com/support/digital-legacy',
        'Use the access key Jeff sent you to request access',
        'Apple verifies and issues a temporary ID — unlocks everything',
    ]
    for b in bullets:
        c.setFont(LABEL_FONT, 8)
        c.setFillColor(GRAY)
        c.drawString(mx, y, '—  ' + b)
        y -= 14

    y -= 6
    rows2 = [
        ('Apple ID',        'jfsneumann@gmail.com'),
        ('iPhone passcode', '— write by hand —'),
        ('Mac login',       '— write by hand —'),
        ('iPad passcode',   '— write by hand —'),
    ]
    for key, val in rows2:
        divider(c, mx, y + 12, W - mx*2)
        cred_row(c, key, val, mx, y, col_w=170)
        y -= 24
    divider(c, mx, y + 12, W - mx*2)

    # ── Section 3: Google ──
    y -= 32
    section_head(c, 3, 'GOOGLE ACCOUNT', mx, y)
    done_badge(c, W - mx - 42, y)

    y -= 18
    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawString(mx, y, 'Done. Allison and Christine are both set as data recipients. Triggers automatically after 3 months of inactivity.')

    y -= 14
    note_text3 = ("Google’s Inactive Account Manager notifies trusted contacts and shares data automatically after 3 months of inactivity.")
    note(c, note_text3, mx, y, width=480)

    y -= 28
    bullets3 = [
        'Google notifies Allison and Christine by email — no action needed',
        'They receive a link to download Gmail, Drive, Photos, and more',
    ]
    for b in bullets3:
        c.setFont(LABEL_FONT, 8)
        c.setFillColor(GRAY)
        c.drawString(mx, y, '—  ' + b)
        y -= 14

    y -= 6
    rows3 = [
        ('Google account', 'jfsneumann@gmail.com'),
        ('Trigger',        '3 months inactivity'),
        ('Recipient 1',    'allicatherine@gmail.com'),
        ('Recipient 2',    'christineneu@gmail.com'),
    ]
    for key, val in rows3:
        divider(c, mx, y + 12, W - mx*2)
        cred_row(c, key, val, mx, y, col_w=170)
        y -= 24
    divider(c, mx, y + 12, W - mx*2)

    # ── Section 4: Bitwarden ──
    y -= 32
    section_head(c, 4, 'EVERYTHING ELSE', mx, y)
    done_badge(c, W - mx - 42, y)

    y -= 18
    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawString(mx, y, f'Done — May 2026. Bitwarden set up with 16 saved passwords. Log in at vault.bitwarden.com with jfsneumann@gmail.com.')

    y -= 14
    note_text4 = ("Bitwarden holds all remaining account passwords — streaming, banking, subscriptions, and more. Log in with the master password Jeff wrote on this sheet.")
    note(c, note_text4, mx, y, width=480)

    y -= 28
    bullets4 = [
        'Go to vault.bitwarden.com — log in with jfsneumann@gmail.com',
        'Master password:                                (written by hand above)',
        '16 accounts saved including: Amazon, Spotify, Peacock, GitHub, Figma, Cleveland Clinic',
    ]
    for b in bullets4:
        c.setFont(LABEL_FONT, 8)
        c.setFillColor(GRAY)
        c.drawString(mx, y, '—  ' + b)
        y -= 14

    y -= 6
    rows4 = [
        ('Bitwarden login',  'vault.bitwarden.com'),
        ('Account email',    'jfsneumann@gmail.com'),
        ('Master password',  '— write here by hand —'),
        ('Accounts saved',   '16 passwords'),
    ]
    for key, val in rows4:
        divider(c, mx, y + 12, W - mx*2)
        cred_row(c, key, val, mx, y, col_w=170)
        y -= 24
    divider(c, mx, y + 12, W - mx*2)

    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawCentredString(W / 2, 32, '2')


# ── PAGE 3: GitHub / Footer ─────────────────────────────────────────────────

def page3(c):
    bg(c)
    mx = 56

    # Orange rule
    c.setFillColor(ORANGE)
    c.rect(mx, H - 44, W - mx*2, 2, fill=1, stroke=0)

    c.setFont(TITLE_BOLD, 18)
    c.setFillColor(INK)
    c.drawString(mx, H - 80, 'GITHUB ARCHIVE')

    c.setFont(LABEL_FONT, 10)
    c.setFillColor(ORANGE)
    c.drawString(mx, H - 106, 'jfsn.com')

    c.setFont(LABEL_FONT, 10)
    c.setFillColor(INK)
    c.drawString(mx, H - 124, 'github.com/JFSNeumann/jfsn-archive')

    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawString(mx, H - 148, 'The full archive source code lives here. Every page, every image path,')
    c.drawString(mx, H - 162, 'every piece of content. Free to fork, share, or hand off to a developer.')

    divider(c, mx, H - 182, W - mx*2)

    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawString(mx, H - 202, f'Generated {DATE}')

    c.setFont(LABEL_FONT, 8)
    c.setFillColor(GRAY)
    c.drawCentredString(W / 2, 32, '3')


# ── Build ───────────────────────────────────────────────────────────────────

c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle('JFSN Archive — For Allison')
c.setAuthor('Jeffrey F. S. Neumann')

page1(c); c.showPage()
page2(c); c.showPage()
page3(c); c.showPage()

c.save()
print(f'Saved: {OUT}')
