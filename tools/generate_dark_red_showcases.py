import os
import re
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

SIZE = 2400
BACKUP_DIR = 'images/backup_original_case_studies'
TARGET_DIR = 'images'

# 8 Primary Case Studies (AVIF files)
PRIMARY_CASE_STUDIES = [
    {
        "filename": "696122fb3dbedd55acef8a93_Focused-Laptop-User-1.avif",
        "src_file": "project-grabz.jpg",
        "brand_name": "Grabz",
        "industry": "FMCG",
        "year": "2022",
        "category": "BRAND IDENTITY  •  PACKAGING DESIGN",
        "index_num": 1,
    },
    {
        "filename": "695e499a92e98299e150ee22_Woman-with-Mug-1-.avif",
        "src_file": "695e499a92e98299e150ee22_Woman-with-Mug-1-.avif",
        "brand_name": "Parishram",
        "industry": "Gifting",
        "year": "2024",
        "category": "CORPORATE GIFTING  •  BRAND IDENTITY",
        "index_num": 2,
    },
    {
        "filename": "6961242d2c0ccd5e3eed4dfa_Profile-with-Stylish-Cap-1.avif",
        "src_file": "6961242d2c0ccd5e3eed4dfa_Profile-with-Stylish-Cap-1.avif",
        "brand_name": "Vilasa Ambrosia",
        "industry": "Luxury",
        "year": "2023",
        "category": "LUXURY REAL ESTATE  •  VISUAL IDENTITY",
        "index_num": 3,
    },
    {
        "filename": "696ebcc5e2d94872a67dd519_Stylish-Red-Sunglasses.avif",
        "src_file": "696ebcc5e2d94872a67dd519_Stylish-Red-Sunglasses.avif",
        "brand_name": "Tastycrafts",
        "industry": "Bakery",
        "year": "2020-26",
        "category": "CONFECTIONERY  •  PACKAGING & CAMPAIGNS",
        "index_num": 4,
    },
    {
        "filename": "695e49e91636af5755512ee2_Close-up-of-Handbag-and-Hand-1-.avif",
        "src_file": "project-youra.jpg",
        "brand_name": "Youra",
        "industry": "Unicotine",
        "year": "2019",
        "category": "LIFESTYLE PRODUCT  •  BRAND POSITIONING",
        "index_num": 5,
    },
    {
        "filename": "695e4a0f4c389489ae730c54_Rhinestone-Hair-Art-1-.avif",
        "src_file": "695e4a0f4c389489ae730c54_Rhinestone-Hair-Art-1-.avif",
        "brand_name": "YMCA",
        "industry": "Lifestyle",
        "year": "2018-26",
        "category": "SPORTS & RECREATION  •  DIGITAL IDENTITY",
        "index_num": 6,
    },
    {
        "filename": "695e4a26a5c9556e865cabb6_Portrait-with-Red-Background-1-.avif",
        "src_file": "695e4a26a5c9556e865cabb6_Portrait-with-Red-Background-1-.avif",
        "brand_name": "Vardhman",
        "industry": "Textiles",
        "year": "2019-26",
        "category": "TEXTILE MANUFACTURING  •  BRAND STRATEGY",
        "index_num": 7,
    },
    {
        "filename": "695e4a3687ebcd95e93aeff9_Green-Butterfly-Close-Up-1-.avif",
        "src_file": "695e4a3687ebcd95e93aeff9_Green-Butterfly-Close-Up-1-.avif",
        "brand_name": "Aegis",
        "industry": "Medical",
        "year": "2024",
        "category": "HEALTHCARE IDENTITY  •  PRODUCT DESIGN",
        "index_num": 8,
    },
]

# 32 Projects (JPG files)
PROJECTS = [
    {
        "filename": "project-jd-group.jpg",
        "src_file": "project-jd-group.jpg",
        "brand_name": "JD Group",
        "industry": "Corporate",
        "year": "2023",
        "category": "CORPORATE IDENTITY  •  BRAND STRATEGY",
        "index_num": 9,
    },
    {
        "filename": "project-bigly-agro.jpg",
        "src_file": "project-bigly-agro.jpg",
        "brand_name": "BIGLY Agro",
        "industry": "Agriculture",
        "year": "2022",
        "category": "AGRICULTURE BRANDING  •  PACKAGING SUITE",
        "index_num": 10,
    },
    {
        "filename": "project-ark-hair-oil.jpg",
        "src_file": "project-ark-hair-oil.jpg",
        "brand_name": "ARK Hair Oil",
        "industry": "Personal Care",
        "year": "2021",
        "category": "HAIRCARE IDENTITY  •  PACKAGING DESIGN",
        "index_num": 11,
    },
    {
        "filename": "project-plutus-school.jpg",
        "src_file": "project-plutus-school.jpg",
        "brand_name": "PLUTUS School",
        "industry": "Education",
        "year": "2023",
        "category": "EDUCATION BRANDING  •  CAMPUS SIGNAGE",
        "index_num": 12,
    },
    {
        "filename": "project-luv-trance.jpg",
        "src_file": "project-luv-trance.jpg",
        "brand_name": "Luv Trance",
        "industry": "Hospitality",
        "year": "2022",
        "category": "HOSPITALITY BRANDING  •  EXPERIENCE DESIGN",
        "index_num": 13,
    },
    {
        "filename": "project-playcent.jpg",
        "src_file": "project-playcent.jpg",
        "brand_name": "Playcent",
        "industry": "Online Gaming",
        "year": "2021",
        "category": "GAMING IDENTITY  •  DIGITAL BRANDING",
        "index_num": 14,
    },
    {
        "filename": "project-kriaa-wellness.jpg",
        "src_file": "project-kriaa-wellness.jpg",
        "brand_name": "Kriaa Wellness",
        "industry": "Packaging",
        "year": "2023",
        "category": "WELLNESS IDENTITY  •  LUXURY PACKAGING",
        "index_num": 15,
    },
    {
        "filename": "project-glogeous.jpg",
        "src_file": "project-glogeous.jpg",
        "brand_name": "Glogeous",
        "industry": "Cosmetics",
        "year": "2023",
        "category": "COSMETICS BRANDING  •  PACKAGING SYSTEM",
        "index_num": 16,
    },
    {
        "filename": "project-titano-led.jpg",
        "src_file": "project-titano-led.jpg",
        "brand_name": "Titano LED",
        "industry": "Electronics",
        "year": "2023",
        "category": "ELECTRONICS BRANDING  •  PRODUCT PACKAGING",
        "index_num": 17,
    },
    {
        "filename": "project-shivala.jpg",
        "src_file": "project-shivala.jpg",
        "brand_name": "Shivala",
        "industry": "Real Estate",
        "year": "2023",
        "category": "REAL ESTATE IDENTITY  •  MARKETING COLLATERAL",
        "index_num": 18,
    },
    {
        "filename": "project-cp-india.jpg",
        "src_file": "project-cp-india.jpg",
        "brand_name": "CP India",
        "industry": "Industrial",
        "year": "2023",
        "category": "INDUSTRIAL BRANDING  •  CORPORATE SYSTEM",
        "index_num": 19,
    },
    {
        "filename": "project-abode.jpg",
        "src_file": "project-abode.jpg",
        "brand_name": "Abode",
        "industry": "Architecture",
        "year": "2023",
        "category": "ARCHITECTURE IDENTITY  •  EDITORIAL DESIGN",
        "index_num": 20,
    },
    {
        "filename": "project-huzzah.jpg",
        "src_file": "project-huzzah.jpg",
        "brand_name": "Huzzah",
        "industry": "Apparel",
        "year": "2023",
        "category": "FASHION BRANDING  •  APPAREL IDENTITY",
        "index_num": 21,
    },
    {
        "filename": "project-coin-dhan.jpg",
        "src_file": "project-coin-dhan.jpg",
        "brand_name": "Coin Dhan",
        "industry": "FinTech",
        "year": "2023",
        "category": "FINTECH IDENTITY  •  DIGITAL PLATFORM",
        "index_num": 22,
    },
    {
        "filename": "project-laxmi-infra.jpg",
        "src_file": "project-laxmi-infra.jpg",
        "brand_name": "Laxmi Infra",
        "industry": "Infrastructure",
        "year": "2022",
        "category": "INFRASTRUCTURE IDENTITY  •  BRAND COLLATERAL",
        "index_num": 23,
    },
    {
        "filename": "project-r-pramodchand.jpg",
        "src_file": "project-r-pramodchand.jpg",
        "brand_name": "R Pramodchand",
        "industry": "Jewellery",
        "year": "2022",
        "category": "HERITAGE JEWELLERY  •  LUXURY IDENTITY",
        "index_num": 24,
    },
    {
        "filename": "project-enlight.jpg",
        "src_file": "project-enlight.jpg",
        "brand_name": "Enlight",
        "industry": "EdTech",
        "year": "2023",
        "category": "EDTECH BRANDING  •  LEARNING MATERIALS",
        "index_num": 25,
    },
    {
        "filename": "project-yogesh-joshi.jpg",
        "src_file": "project-yogesh-joshi.jpg",
        "brand_name": "Yogesh Joshi",
        "industry": "Personal Branding",
        "year": "2023",
        "category": "PERSONAL IDENTITY  •  MEDIA RELATIONS",
        "index_num": 26,
    },
    {
        "filename": "project-vijay-trivedi-group.jpg",
        "src_file": "project-vijay-trivedi-group.jpg",
        "brand_name": "Vijay Trivedi Group",
        "industry": "Corporate Branding",
        "year": "2023",
        "category": "CORPORATE IDENTITY  •  BRAND GUIDELINES",
        "index_num": 27,
    },
    {
        "filename": "project-ecoforest.jpg",
        "src_file": "project-ecoforest.jpg",
        "brand_name": "Ecoforest",
        "industry": "Sustainable & Organic",
        "year": "2022",
        "category": "ORGANIC BRANDING  •  ECO PACKAGING",
        "index_num": 28,
    },
    {
        "filename": "project-farmbyte.jpg",
        "src_file": "project-farmbyte.jpg",
        "brand_name": "Farmbyte",
        "industry": "Agro & Packaging",
        "year": "2022",
        "category": "AGRO IDENTITY  •  PACKAGING SUITE",
        "index_num": 29,
    },
    {
        "filename": "project-prajay-steel.jpg",
        "src_file": "project-prajay-steel.jpg",
        "brand_name": "Prajay Steel",
        "industry": "Industrial Identity",
        "year": "2022",
        "category": "STEEL INDUSTRIAL  •  CORPORATE SYSTEM",
        "index_num": 30,
    },
    {
        "filename": "project-gabbar.jpg",
        "src_file": "project-gabbar.jpg",
        "brand_name": "Gabbar",
        "industry": "FMCG & Snacks",
        "year": "2023",
        "category": "SNACKS BRANDING  •  FOOD PACKAGING",
        "index_num": 31,
    },
    {
        "filename": "project-jimmy.jpg",
        "src_file": "project-jimmy.jpg",
        "brand_name": "Jimmy",
        "industry": "Lifestyle & Beverage",
        "year": "2023",
        "category": "BEVERAGE BRANDING  •  NAMKEEN PACKAGING",
        "index_num": 32,
    },
    {
        "filename": "project-aloevella.jpg",
        "src_file": "project-aloevella.jpg",
        "brand_name": "Aloevella",
        "industry": "Herbal Cosmetics",
        "year": "2022",
        "category": "HERBAL BRANDING  •  COSMETIC PACKAGING",
        "index_num": 33,
    },
    {
        "filename": "project-beatitude.jpg",
        "src_file": "project-beatitude.jpg",
        "brand_name": "Beatitude",
        "industry": "Luxury Handcrafted",
        "year": "2023",
        "category": "HANDCRAFTED LUXURY  •  BRAND IDENTITY",
        "index_num": 34,
    },
    {
        "filename": "project-polka-tots.jpg",
        "src_file": "project-polka-tots.jpg",
        "brand_name": "Polka Tots",
        "industry": "Baby & Kids Care",
        "year": "2023",
        "category": "BABY CARE BRANDING  •  KIDS PACKAGING",
        "index_num": 35,
    },
    {
        "filename": "project-maruti-barrier-films.jpg",
        "src_file": "project-maruti-barrier-films.jpg",
        "brand_name": "Maruti Barrier Films",
        "industry": "Industrial Packaging",
        "year": "2023",
        "category": "BARRIER FILMS  •  INDUSTRIAL PACKAGING",
        "index_num": 36,
    },
    {
        "filename": "project-crispo.jpg",
        "src_file": "project-crispo.jpg",
        "brand_name": "Crispo",
        "industry": "Snacks & Food",
        "year": "2022",
        "category": "FOOD BRANDING  •  POUCH PACKAGING",
        "index_num": 37,
    },
    {
        "filename": "project-senal-diamonds.jpg",
        "src_file": "project-senal-diamonds.jpg",
        "brand_name": "Senal Diamonds",
        "industry": "Fine Jewellery",
        "year": "2023",
        "category": "FINE JEWELLERY  •  LUXURY IDENTITY",
        "index_num": 38,
    },
    {
        "filename": "project-grabz.jpg",
        "src_file": "project-grabz.jpg",
        "brand_name": "Grabz",
        "industry": "FMCG",
        "year": "2022",
        "category": "COMPLETE BRANDING  •  SNACKS PACKAGING",
        "index_num": 1,
    },
    {
        "filename": "project-youra.jpg",
        "src_file": "project-youra.jpg",
        "brand_name": "Youra",
        "industry": "Unicotine",
        "year": "2019",
        "category": "PREMIUM LIFESTYLE  •  IDENTITY DESIGN",
        "index_num": 5,
    },
]

def create_dark_red_showcase(brand_name, industry, year, category, index_num, src_image_path):
    img = Image.new('RGB', (SIZE, SIZE), '#160204')
    
    # Spotlight glow
    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    d_glow = ImageDraw.Draw(glow)
    cx, cy = SIZE // 2, SIZE // 2 + 60
    for r in range(int(SIZE * 0.72), 0, -25):
        alpha = int(48 * (1 - r / (SIZE * 0.72)) ** 1.6)
        d_glow.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(135, 18, 28, alpha))
    img.paste(glow, (0, 0), glow)
    
    inset = 90
    d = ImageDraw.Draw(img)
    
    # Outer hairline border
    d.rectangle([(inset, inset), (SIZE - inset, SIZE - inset)], outline='#3d0a10', width=2)
    cross_size = 18
    for cx_pt, cy_pt in [
        (inset + 26, inset + 26),
        (SIZE - inset - 26, inset + 26),
        (inset + 26, SIZE - inset - 26),
        (SIZE - inset - 26, SIZE - inset - 26),
    ]:
        d.line([(cx_pt - cross_size, cy_pt), (cx_pt + cross_size, cy_pt)], fill='#6a1822', width=2)
        d.line([(cx_pt, cy_pt - cross_size), (cx_pt, cy_pt + cross_size)], fill='#6a1822', width=2)
        
    font_meta = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 38, index=1)
    font_sub = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 36, index=1)
    
    # Top Left metadata
    d.text((inset + 60, inset + 60), f'[ CASE STUDY {index_num:02d} ]', fill='#EAEAEA', font=font_meta)
    
    # Top Right metadata
    tr_text = f'{industry.upper()}  //  {year}'
    b_tr = d.textbbox((0, 0), tr_text, font=font_meta)
    d.text((SIZE - inset - 60 - (b_tr[2] - b_tr[0]), inset + 60), tr_text, fill='#EAEAEA', font=font_meta)
    
    # Brand Name (dynamic sizing to prevent overflow)
    max_w = SIZE - 400
    font_size = 160
    while font_size > 80:
        f_title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Black.ttf', font_size)
        b_title = d.textbbox((0, 0), brand_name, font=f_title)
        tw = b_title[2] - b_title[0]
        if tw <= max_w:
            break
        font_size -= 5
        
    b_title = d.textbbox((0, 0), brand_name, font=f_title)
    tw = b_title[2] - b_title[0]
    th = b_title[3] - b_title[1]
    title_x = (SIZE - tw) // 2 - b_title[0]
    title_y = inset + 120
    d.text((title_x, title_y), brand_name, fill='#FFFFFF', font=f_title)
    
    # Subtitle under title with guaranteed 35px gap from actual bottom
    sub = category.upper()
    b_sub = d.textbbox((0, 0), sub, font=font_sub)
    sw = b_sub[2] - b_sub[0]
    sub_y = title_y + b_title[3] + 35
    d.text(((SIZE - sw) // 2, sub_y), sub, fill='#C48288', font=font_sub)
    
    # Product showcase frame geometry
    frame_y = sub_y + (b_sub[3] - b_sub[0]) + 65
    footer_top = SIZE - inset - 130
    frame_h = footer_top - frame_y
    frame_w = int(frame_h * 1.25)
    if frame_w > SIZE - (inset * 2) - 100:
        frame_w = SIZE - (inset * 2) - 100
    fx = (SIZE - frame_w) // 2
    fy = frame_y
    
    orig = Image.open(src_image_path).convert('RGB')
    orig_fitted = ImageOps.fit(orig, (frame_w, frame_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    
    mask = Image.new('L', (frame_w, frame_h), 0)
    d_mask = ImageDraw.Draw(mask)
    d_mask.rounded_rectangle([(0, 0), (frame_w, frame_h)], radius=32, fill=255)
    
    # Deep soft shadow
    shadow = Image.new('RGBA', (frame_w + 140, frame_h + 140), (0, 0, 0, 0))
    d_sh = ImageDraw.Draw(shadow)
    d_sh.rounded_rectangle([(45, 45), (frame_w + 95, frame_h + 95)], radius=36, fill=(0, 0, 0, 210))
    shadow = shadow.filter(ImageFilter.GaussianBlur(38))
    img.paste(shadow, (fx - 70, fy - 45), shadow)
    
    # Paste framed product image
    img.paste(orig_fitted, (fx, fy), mask)
    
    # Border around product frame
    d.rounded_rectangle([(fx, fy), (fx + frame_w, fy + frame_h)], radius=32, outline='#5a151e', width=3)
    
    # Bottom Left footer
    d.text((inset + 60, SIZE - inset - 95), 'BUTTERCUP ADVERTISING STUDIO', fill='#7A252E', font=font_meta)
    
    # Bottom Right footer
    r_text = 'EXPLORE CASE STUDY'
    b_r = d.textbbox((0, 0), r_text, font=font_meta)
    rx = SIZE - inset - 60 - (b_r[2] - b_r[0]) - 50
    d.text((rx, SIZE - inset - 95), r_text, fill='#EAEAEA', font=font_meta)
    arr_x = SIZE - inset - 60 - 35
    arr_y = SIZE - inset - 78
    d.line([(arr_x, arr_y), (arr_x + 30, arr_y)], fill='#EAEAEA', width=3)
    d.line([(arr_x + 20, arr_y - 10), (arr_x + 30, arr_y)], fill='#EAEAEA', width=3)
    d.line([(arr_x + 20, arr_y + 10), (arr_x + 30, arr_y)], fill='#EAEAEA', width=3)
    
    return img

def main():
    print("=== Generating 8 Primary Case Study AVIF Posters (Dark Red Showcase) ===")
    for idx, cs in enumerate(PRIMARY_CASE_STUDIES, 1):
        src_path = os.path.join(BACKUP_DIR, cs['src_file'])
        out_path = os.path.join(TARGET_DIR, cs['filename'])
        print(f"[{idx}/8] Generating AVIF {cs['brand_name']} from {cs['src_file']}...")
        poster = create_dark_red_showcase(
            brand_name=cs['brand_name'],
            industry=cs['industry'],
            year=cs['year'],
            category=cs['category'],
            index_num=cs['index_num'],
            src_image_path=src_path
        )
        poster.save(out_path, format='AVIF', quality=95)

    print("\n=== Generating 32 Project JPG Posters (Dark Red Showcase) ===")
    for idx, p in enumerate(PROJECTS, 1):
        src_path = os.path.join(BACKUP_DIR, p['src_file'])
        out_path = os.path.join(TARGET_DIR, p['filename'])
        print(f"[{idx:02d}/32] Generating JPG {p['brand_name']} from {p['src_file']}...")
        poster = create_dark_red_showcase(
            brand_name=p['brand_name'],
            industry=p['industry'],
            year=p['year'],
            category=p['category'],
            index_num=p['index_num'],
            src_image_path=src_path
        )
        poster.save(out_path, format='JPEG', quality=95)

    print("\nAll 40 Dark Red Showcase posters generated successfully!")

    # Update cache busters to ?v=80 across all HTML files
    print("\n=== Updating cache-busters across all HTML files to ?v=80 ===")
    target_files = glob.glob('*.html') + glob.glob('projects/*.html')

    pattern = re.compile(
        r'((?:(?:\.\./)?images/(?:project-[a-zA-Z0-9_\-]+|69[a-zA-Z0-9_\-\(\)]+)\.(?:jpg|avif)))(?:\?v=\d+)?',
        re.IGNORECASE
    )

    total_updated = 0
    for file_path in target_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content, count = pattern.subn(r'\1?v=80', content)
        if count > 0:
            total_updated += count
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

    print(f"Updated {total_updated} image references with ?v=80 cache buster across HTML files.")

if __name__ == '__main__':
    main()
