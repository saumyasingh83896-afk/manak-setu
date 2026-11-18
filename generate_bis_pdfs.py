import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

DATA_DIR = Path("./bis_data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

def build_pdf(filepath: Path, title: str, pages_data: list):
    doc = SimpleDocTemplate(
        str(filepath),
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1A365D'),
        spaceAfter=10,
    )
    heading_style = ParagraphStyle(
        'ClauseHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2B6CB0'),
        spaceBefore=8,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        'ClauseBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#2D3748'),
        spaceAfter=6,
    )
    
    story = []
    
    for page_idx, clauses in enumerate(pages_data):
        if page_idx > 0:
            story.append(PageBreak())
        
        story.append(Paragraph(f"<b>BUREAU OF INDIAN STANDARDS</b>", body_style))
        story.append(Paragraph(f"<b>{title} - (Page {page_idx + 1})</b>", title_style))
        story.append(Spacer(1, 10))
        
        for heading, body in clauses:
            if heading:
                story.append(Paragraph(f"<b>{heading}</b>", heading_style))
            if body:
                story.append(Paragraph(body, body_style))
            story.append(Spacer(1, 4))
            
    doc.build(story)
    print(f"Generated standard PDF: {filepath.name}")

# ==============================================================================
# 1. IS 14543: Packaged Drinking Water Specification
# ==============================================================================
is_14543_data = [
    [
        ("IS 14543 : 2016 - Clause 1: SCOPE", 
         "This standard prescribes the requirements and methods of sampling and test for packaged drinking water other than packaged natural mineral water for direct human consumption."),
        ("Clause 3: DEFINITIONS & SOURCE WATER", 
         "Packaged Drinking Water is water derived from any potable source subjected to multiple treatment steps including decantation, filtration, micron filtration, activated carbon filtration, reverse osmosis (RO), demineralization, and terminal disinfection through Ozonation or Ultraviolet (UV) irradiation before packaging."),
        ("Clause 4: HYGIENIC MANUFACTURING CONDITIONS", 
         "The water processing, filling, and sealing must be conducted under strict hygienic conditions conforming to IS 14352 (Code for hygienic conditions in food processing industries). Filling lines must be automated within a Class 10,000 cleanroom environment.")
    ],
    [
        ("IS 14543 : 2016 - Clause 5: PHYSICAL AND CHEMICAL LIMITS", 
         "5.1 Total Dissolved Solids (TDS): Shall be within 75 mg/l to 500 mg/l.<br/>"
         "5.2 pH Value: Shall be between 6.5 and 8.5.<br/>"
         "5.3 Turbidity: Maximum 2 NTU.<br/>"
         "5.4 Colour: Maximum 2 Hazen units.<br/>"
         "5.5 Lead (as Pb): Max 0.01 mg/l; Arsenic (as As): Max 0.01 mg/l; Nitrate: Max 45 mg/l."),
        ("Clause 6: MICROBIOLOGICAL REQUIREMENTS", 
         "6.1 Escherichia coli & Coliform bacteria: Must be completely ABSENT in any 250 ml sample.<br/>"
         "6.2 Faecal Streptococci and Staphylococcus aureus: Must be ABSENT in 250 ml sample.<br/>"
         "6.3 Yeast and Mould: Absent in 250 ml.<br/>"
         "6.4 Total Viable Colony Count at 37°C: Not more than 20 CFU/ml within 24 hours of packaging."),
        ("Clause 7: PACKAGING REQUIREMENTS", 
         "The water shall be packed in clean, hygienic, food-grade transparent PET containers conforming to IS 15410 or polycarbonate carboys conforming to IS 14971. All containers must be hermetically sealed with tamper-evident caps.")
    ],
    [
        ("IS 14543 : 2016 - Clause 8: MANDATORY MARKING & LABELLING", 
         "Every bottle or jar must display: 1) Product name: 'PACKAGED DRINKING WATER', 2) Net quantity, 3) Brand name and complete manufacturer details, 4) Batch/Lot Number, 5) Date of Manufacture and Best Before, 6) Water treatments applied (e.g. Reverse Osmosis & Ozonation), 7) Storage advisory: 'Store away from direct sunlight'."),
        ("Clause 9: MANDATORY BIS CERTIFICATION (SCHEME-I)", 
         "Under FSSAI and Section 14 of the BIS Act 2016, manufacturing and selling Packaged Drinking Water is strictly prohibited without a valid BIS ISI Mark Licence under Product Certification Scheme-I.<br/>"
         "The manufacturer must set up an in-house laboratory equipped to conduct all routine microbiological and chemical tests and employ a dedicated qualified chemist and microbiologist.")
    ]
]

# ==============================================================================
# 2. IS 15820 & BIS Hallmarking Guidelines
# ==============================================================================
is_hallmark_data = [
    [
        ("IS 15820 / BIS Hallmarking Regulations - Clause 1: MANDATORY GOLD HALLMARKING", 
         "Hallmarking is the accurate determination and official recording of the precious metal content in gold and silver articles. Mandatory Hallmarking of gold jewellery is governed by the Hallmarking Order and IS 15820."),
        ("Clause 2: RECOGNIZED PURITY GRADES FOR GOLD JEWELLERY", 
         "Gold jewellery can only be hallmarked in the following 6 standardized purity grades (Caratage & Fineness):<br/>"
         "• 24K : 999 (99.9% pure gold)<br/>"
         "• 23K : 958 (95.8% pure gold)<br/>"
         "• 22K : 916 (91.6% pure gold - Most widely manufactured jewellery)<br/>"
         "• 20K : 833 (83.3% pure gold)<br/>"
         "• 18K : 750 (75.0% pure gold - Standard for diamond studded jewellery)<br/>"
         "• 14K : 585 (58.5% pure gold)<br/>"
         "• 9K : 375 (37.5% pure gold)")
    ],
    [
        ("Clause 3: 3-SYMBOL HALLMARKING & HUID STRUCTURE", 
         "Under the current BIS Hallmarking regime, every genuine gold jewellery piece carries exactly 3 distinct laser-etched marks:<br/>"
         "1. BIS Standard Logo (The triangular BIS mark).<br/>"
         "2. Purity / Fineness Grade (e.g., '22K916' or '18K750').<br/>"
         "3. 6-Digit Alphanumeric HUID (Hallmark Unique Identification code, e.g. 'AB12CD')."),
        ("Clause 4: WHAT IS HUID & CONSUMER VERIFICATION", 
         "4.1 HUID is a unique 6-character identifier assigned to each individual jewellery article at Assaying and Hallmarking Centres (AHC).<br/>"
         "4.2 Traceability: Consumers can verify the jeweller registration, AHC details, purity grade, and hallmarking date by entering the 6-digit HUID code into the official <b>'BIS CARE' Mobile App</b>."),
        ("Clause 5: JEWELLER REGISTRATION & MSME EXEMPTIONS", 
         "5.1 Jeweller Registration is completely online, one-time, and zero-fee on the Manakonline portal.<br/>"
         "5.2 Turnover Exemption: Small jewellers with an annual turnover up to Rs 40 Lakhs are exempted from mandatory hallmarking.<br/>"
         "5.3 Hallmarking fee charged by AHC is fixed by BIS at Rs 45 per article (+ GST).")
    ]
]

# ==============================================================================
# 3. BIS MSME Product Certification (Scheme-I)
# ==============================================================================
is_msme_data = [
    [
        ("BIS Scheme-I (Conformity Assessment) - Clause 1: LICENSING PROCEDURES", 
         "1.1 Normal Procedure: Application submission on Manakonline -> Preliminary Factory Audit by BIS officer -> Sample drawing -> Third-party lab testing -> Grant of Licence (Timeline: 60-90 days).<br/>"
         "1.2 Simplified Procedure (Fast-Track for MSMEs): Manufacturer gets sample tested beforehand in a BIS-approved lab -> Submits complete application with passing test report -> Licence granted within 30 days -> Verification factory audit conducted post-licence."),
        ("Clause 2: FINANCIAL CONCESSIONS FOR MSMEs & STARTUPS", 
         "To promote Ease of Doing Business, BIS provides statutory fee concessions:<br/>"
         "• 50% Concession on Application Fee for Micro and Small Enterprises holding a valid Udyam Registration Certificate.<br/>"
         "• 50% Concession on Annual Minimum Marking Fee for Micro Enterprises.<br/>"
         "• 20% Concession on Annual Minimum Marking Fee for Small Enterprises.<br/>"
         "• Special fast-track processing for DPIIT-recognized Startups and Women-led enterprises.")
    ],
    [
        ("Clause 3: IN-HOUSE TESTING & QUALITY INFRASTRUCTURE", 
         "To qualify for an ISI Mark Licence under Scheme-I, every factory must establish:<br/>"
         "1. Manufacturing equipment specified in the Product Manual.<br/>"
         "2. In-house Testing Laboratory equipped to conduct all routine and acceptance tests according to the Scheme of Inspection and Testing (SIT).<br/>"
         "3. Calibrated testing instruments with valid calibration certificates.<br/>"
         "4. A qualified Technical Supervisor / Quality Control Chemist to manage quality registers."),
        ("Clause 4: SURVEILLANCE & VALIDITY", 
         "4.1 Initial licences are granted for 1 to 2 years, renewable up to 5 years via online self-declaration on Manakonline.<br/>"
         "4.2 BIS officers conduct periodic surprise factory audits and draw market samples to ensure continuous conformity to Indian Standards.")
    ]
]

if __name__ == "__main__":
    build_pdf(DATA_DIR / "IS_14543_Packaged_Drinking_Water.pdf", "IS 14543:2016 (Packaged Drinking Water)", is_14543_data)
    build_pdf(DATA_DIR / "IS_15820_Gold_Hallmarking_and_HUID.pdf", "IS 15820 & BIS Hallmarking Guidelines", is_hallmark_data)
    build_pdf(DATA_DIR / "BIS_Conformity_Assessment_MSME_Scheme_I.pdf", "BIS Scheme-I Product Certification for MSMEs", is_msme_data)
    print("All BIS standards generated successfully using ReportLab!")
