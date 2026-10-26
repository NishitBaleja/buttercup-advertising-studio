import os
import re
import glob
from PIL import Image, ImageDraw, ImageFont

SIZE = 2400

# 8 Primary Case Studies (AVIF files)
PRIMARY_CASE_STUDIES = [
    {
        "filename": "696122fb3dbedd55acef8a93_Focused-Laptop-User-1.avif",
        "brand_name": "Grabz",
        "industry": "FMCG",
        "year": "2022",
        "category": "BRAND IDENTITY  •  PACKAGING DESIGN",
        "index_num": 1,
    },
    {
        "filename": "695e499a92e98299e150ee22_Woman-with-Mug-1-.avif",
        "brand_name": "Parishram",
        "industry": "Gifting",
        "year": "2024",
        "category": "CORPORATE GIFTING  •  BRAND IDENTITY",
        "index_num": 2,
    },
    {
        "filename": "6961242d2c0ccd5e3eed4dfa_Profile-with-Stylish-Cap-1.avif",
        "brand_name": "Vilasa Ambrosia",
        "industry": "Luxury",
        "year": "2023",
        "category": "LUXURY REAL ESTATE  •  VISUAL IDENTITY",
        "index_num": 3,
    },
    {
        "filename": "696ebcc5e2d94872a67dd519_Stylish-Red-Sunglasses.avif",
        "brand_name": "Tastycrafts",
        "industry": "Bakery",
        "year": "2020-26",
        "category": "CONFECTIONERY  •  PACKAGING & CAMPAIGNS",
        "index_num": 4,
    },
    {
        "filename": "695e49e91636af5755512ee2_Close-up-of-Handbag-and-Hand-1-.avif",
        "brand_name": "Youra",
        "industry": "Unicotine",
        "year": "2019",
        "category": "LIFESTYLE PRODUCT  •  BRAND POSITIONING",
        "index_num": 5,
    },
    {
        "filename": "695e4a0f4c389489ae730c54_Rhinestone-Hair-Art-1-.avif",
        "brand_name": "YMCA",
        "industry": "Lifestyle",
        "year": "2018-26",
        "category": "SPORTS & RECREATION  •  DIGITAL IDENTITY",
        "index_num": 6,
    },
    {
        "filename": "695e4a26a5c9556e865cabb6_Portrait-with-Red-Background-1-.avif",
        "brand_name": "Vardhman",
        "industry": "Textiles",
        "year": "2019-26",
        "category": "TEXTILE MANUFACTURING  •  BRAND STRATEGY",
        "index_num": 7,
    },
    {
        "filename": "695e4a3687ebcd95e93aeff9_Green-Butterfly-Close-Up-1-.avif",
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
        "brand_name": "JD Group",
        "industry": "Corporate",
        "year": "2023",
        "category": "CORPORATE IDENTITY  •  BRAND STRATEGY",
        "index_num": 9,
    },
    {
        "filename": "project-bigly-agro.jpg",
        "brand_name": "BIGLY Agro",
        "industry": "Agriculture",
        "year": "2022",
        "category": "AGRICULTURE BRANDING  •  PACKAGING SUITE",
        "index_num": 10,
    },
    {
        "filename": "project-ark-hair-oil.jpg",
        "brand_name": "ARK Hair Oil",
        "industry": "Personal Care",
        "year": "2021",
        "category": "HAIRCARE IDENTITY  •  PACKAGING DESIGN",
        "index_num": 11,
    },
    {
        "filename": "project-plutus-school.jpg",
        "brand_name": "PLUTUS School",
        "industry": "Education",
        "year": "2023",
        "category": "EDUCATION BRANDING  •  CAMPUS SIGNAGE",
        "index_num": 12,
    },
    {
        "filename": "project-luv-trance.jpg",
        "brand_name": "Luv Trance",
        "industry": "Hospitality",
        "year": "2022",
        "category": "HOSPITALITY BRANDING  •  EXPERIENCE DESIGN",
        "index_num": 13,
    },
    {
        "filename": "project-playcent.jpg",
        "brand_name": "Playcent",
        "industry": "Online Gaming",
        "year": "2021",
        "category": "GAMING IDENTITY  •  DIGITAL BRANDING",
        "index_num": 14,
    },
    {
        "filename": "project-kriaa-wellness.jpg",
        "brand_name": "Kriaa Wellness",
        "industry": "Packaging",
        "year": "2023",
        "category": "WELLNESS IDENTITY  •  LUXURY PACKAGING",
        "index_num": 15,
    },
    {
        "filename": "project-glogeous.jpg",
        "brand_name": "Glogeous",
        "industry": "Cosmetics",
        "year": "2023",
        "category": "COSMETICS BRANDING  •  PACKAGING SYSTEM",
        "index_num": 16,
    },
    {
        "filename": "project-titano-led.jpg",
        "brand_name": "Titano LED",
        "industry": "Electronics",
        "year": "2023",
        "category": "ELECTRONICS BRANDING  •  PRODUCT PACKAGING",
        "index_num": 17,
    },
    {
        "filename": "project-shivala.jpg",
        "brand_name": "Shivala",
        "industry": "Real Estate",
        "year": "2023",
        "category": "REAL ESTATE IDENTITY  •  MARKETING COLLATERAL",
        "index_num": 18,
    },
    {
        "filename": "project-cp-india.jpg",
        "brand_name": "CP India",
        "industry": "Industrial",
        "year": "2023",
        "category": "INDUSTRIAL BRANDING  •  CORPORATE SYSTEM",
        "index_num": 19,
    },
    {
        "filename": "project-abode.jpg",
        "brand_name": "Abode",
        "industry": "Architecture",
        "year": "2023",
        "category": "ARCHITECTURE IDENTITY  •  EDITORIAL DESIGN",
        "index_num": 20,
    },
    {
        "filename": "project-huzzah.jpg",
        "brand_name": "Huzzah",
        "industry": "Apparel",
        "year": "2023",
        "category": "FASHION BRANDING  •  APPAREL IDENTITY",
        "index_num": 21,
    },
    {
        "filename": "project-coin-dhan.jpg",
        "brand_name": "Coin Dhan",
        "industry": "FinTech",
        "year": "2023",
        "category": "FINTECH IDENTITY  •  DIGITAL PLATFORM",
        "index_num": 22,
    },
    {
        "filename": "project-laxmi-infra.jpg",
        "brand_name": "Laxmi Infra",
        "industry": "Infrastructure",
        "year": "2022",
        "category": "INFRASTRUCTURE IDENTITY  •  BRAND COLLATERAL",
        "index_num": 23,
    },
    {
        "filename": "project-r-pramodchand.jpg",
        "brand_name": "R Pramodchand",
        "industry": "Jewellery",
        "year": "2022",
        "category": "HERITAGE JEWELLERY  •  LUXURY IDENTITY",
        "index_num": 24,
    },
    {
        "filename": "project-enlight.jpg",
        "brand_name": "Enlight",
        "industry": "EdTech",
        "year": "2023",
        "category": "EDTECH BRANDING  •  LEARNING MATERIALS",
        "index_num": 25,
    },
    {
        "filename": "project-yogesh-joshi.jpg",
        "brand_name": "Yogesh Joshi",
        "industry": "Personal Branding",
        "year": "2023",
        "category": "PERSONAL IDENTITY  •  MEDIA RELATIONS",
        "index_num": 26,
    },
    {
        "filename": "project-vijay-trivedi-group.jpg",
        "brand_name": "Vijay Trivedi Group",
        "industry": "Corporate Branding",
        "year": "2023",
        "category": "CORPORATE IDENTITY  •  BRAND GUIDELINES",
        "index_num": 27,
    },
    {
        "filename": "project-ecoforest.jpg",
        "brand_name": "Ecoforest",
        "industry": "Sustainable & Organic",
        "year": "2022",
        "category": "ORGANIC BRANDING  •  ECO PACKAGING",
        "index_num": 28,
    },
    {
        "filename": "project-farmbyte.jpg",
        "brand_name": "Farmbyte",
        "industry": "Agro & Packaging",
        "year": "2022",
        "category": "AGRO IDENTITY  •  PACKAGING SUITE",
        "index_num": 29,
    },
    {
        "filename": "project-prajay-steel.jpg",
        "brand_name": "Prajay Steel",
        "industry": "Industrial Identity",
        "year": "2022",
        "category": "STEEL INDUSTRIAL  •  CORPORATE SYSTEM",
        "index_num": 30,
    },
    {
        "filename": "project-gabbar.jpg",
        "brand_name": "Gabbar",
        "industry": "FMCG & Snacks",
        "year": "2023",
        "category": "SNACKS BRANDING  •  FOOD PACKAGING",
        "index_num": 31,
    },
    {
        "filename": "project-jimmy.jpg",
        "brand_name": "Jimmy",
        "industry": "Lifestyle & Beverage",
        "year": "2023",
        "category": "BEVERAGE BRANDING  •  NAMKEEN PACKAGING",
        "index_num": 32,
    },
    {
        "filename": "project-aloevella.jpg",
        "brand_name": "Aloevella",
        "industry": "Herbal Cosmetics",
        "year": "2022",
        "category": "HERBAL BRANDING  •  COSMETIC PACKAGING",
        "index_num": 33,
    },
    {
        "filename": "project-beatitude.jpg",
        "brand_name": "Beatitude",
        "industry": "Luxury Handcrafted",
        "year": "2023",
        "category": "HANDCRAFTED LUXURY  •  BRAND IDENTITY",
        "index_num": 34,
    },
    {
        "filename": "project-polka-tots.jpg",
        "brand_name": "Polka Tots",
        "industry": "Baby & Kids Care",
        "year": "2023",
        "category": "BABY CARE BRANDING  •  KIDS PACKAGING",
        "index_num": 35,
    },
    {
        "filename": "project-maruti-barrier-films.jpg",
        "brand_name": "Maruti Barrier Films",
        "industry": "Industrial Packaging",
        "year": "2023",
        "category": "BARRIER FILMS  •  INDUSTRIAL PACKAGING",
        "index_num": 36,
    },
    {
        "filename": "project-crispo.jpg",
        "brand_name": "Crispo",
        "industry": "Snacks & Food",
        "year": "2022",
        "category": "FOOD BRANDING  •  POUCH PACKAGING",
        "index_num": 37,
    },
    {
        "filename": "project-senal-diamonds.jpg",
        "brand_name": "Senal Diamonds",
        "industry": "Fine Jewellery",
        "year": "2023",
        "category": "FINE JEWELLERY  •  LUXURY IDENTITY",
        "index_num": 38,
    },
    {
        "filename": "project-grabz.jpg",
        "brand_name": "Grabz",
        "industry": "FMCG",
        "year": "2022",
        "category": "COMPLETE BRANDING  •  SNACKS PACKAGING",
        "index_num": 1,
    },
    {
        "filename": "project-youra.jpg",
        "brand_name": "Youra",
        "industry": "Unicotine",
        "year": "2019",
        "category": "PREMIUM LIFESTYLE  •  IDENTITY DESIGN",
        "index_num": 5,
    },
]

def draw_arrow(draw, x, y, size=34, color='#000000'):
    draw.line([(x, y), (x + size, y)], fill=color, width=4)
    draw.line([(x + size - 12, y - 12), (x + size, y)], fill=color, width=4)
    draw.line([(x + size - 12, y + 12), (x + size, y)], fill=color, width=4)

def create_square_poster(brand_name, industry, year, category, index_num):
    img = Image.new('RGB', (SIZE, SIZE), color='#FFFFFF')
    d = ImageDraw.Draw(img)
    inset = 90
    
    # Outer hairline border
    d.rectangle([(inset, inset), (SIZE - inset, SIZE - inset)], outline='#E8E8E8', width=3)
    
    # Corner registration marks (+)
    cross_size = 18
    for cx, cy in [
        (inset + 26, inset + 26),
        (SIZE - inset - 26, inset + 26),
        (inset + 26, SIZE - inset - 26),
        (SIZE - inset - 26, SIZE - inset - 26),
    ]:
        d.line([(cx - cross_size, cy), (cx + cross_size, cy)], fill='#CCCCCC', width=3)
        d.line([(cx, cy - cross_size), (cx, cy + cross_size)], fill='#CCCCCC', width=3)

    font_meta = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 38, index=1)
    font_sub = ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', 40, index=1)

    # Top Left metadata
    meta_tl = f'[ CASE STUDY {index_num:02d} ]'
    d.text((inset + 60, inset + 60), meta_tl, fill='#111111', font=font_meta)

    # Top Right metadata
    meta_tr = f'{industry.upper()}  //  {year}'
    b_tr = d.textbbox((0, 0), meta_tr, font=font_meta)
    d.text((SIZE - inset - 60 - (b_tr[2] - b_tr[0]), inset + 60), meta_tr, fill='#111111', font=font_meta)

    # Main Brand Name dynamic sizing
    # Safe inner width: at least 220px margin on each side to prevent ANY clipping
    max_w = SIZE - 440
    font_size = 400
    while font_size > 120:
        f = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Black.ttf', font_size)
        b = d.textbbox((0, 0), brand_name, font=f)
        tw = b[2] - b[0]
        if tw <= max_w:
            break
        font_size -= 10

    b = d.textbbox((0, 0), brand_name, font=f)
    tw = b[2] - b[0]
    th = b[3] - b[1]
    tx = (SIZE - tw) // 2 - b[0]
    ty = (SIZE - th) // 2 - 90 - b[1]
    d.text((tx, ty), brand_name, fill='#000000', font=f)

    # Subtitle Category
    sub = category.upper()
    b_sub = d.textbbox((0, 0), sub, font=font_sub)
    sw = b_sub[2] - b_sub[0]
    sub_y = ty + b[3] + 90
    d.text(((SIZE - sw) // 2, sub_y), sub, fill='#666666', font=font_sub)

    # Bottom Left footer
    d.text((inset + 60, SIZE - inset - 100), 'BUTTERCUP ADVERTISING STUDIO', fill='#888888', font=font_meta)

    # Bottom Right footer with arrow
    r_text = 'EXPLORE CASE STUDY'
    b_r = d.textbbox((0, 0), r_text, font=font_meta)
    rx = SIZE - inset - 60 - (b_r[2] - b_r[0]) - 60
    d.text((rx, SIZE - inset - 100), r_text, fill='#111111', font=font_meta)
    draw_arrow(d, SIZE - inset - 60 - 40, SIZE - inset - 82, size=32, color='#111111')

    return img

def main():
    target_dir = 'images'
    
    # 1. Generate 8 Primary Case Study AVIF posters (Square 1:1)
    print("=== Generating 8 Primary Case Study AVIF Posters (Square 1:1) ===")
    for idx, cs in enumerate(PRIMARY_CASE_STUDIES, 1):
        out_path = os.path.join(target_dir, cs['filename'])
        print(f"[{idx}/8] Generating AVIF {cs['brand_name']} -> {out_path}...")
        img = create_square_poster(
            brand_name=cs['brand_name'],
            industry=cs['industry'],
            year=cs['year'],
            category=cs['category'],
            index_num=cs['index_num']
        )
        img.save(out_path, format='AVIF', quality=95)

    # 2. Generate 32 Project JPG posters (Square 1:1)
    print("\n=== Generating 32 Project JPG Posters (Square 1:1) ===")
    for idx, p in enumerate(PROJECTS, 1):
        out_path = os.path.join(target_dir, p['filename'])
        print(f"[{idx:02d}/32] Generating JPG {p['brand_name']} -> {out_path}...")
        img = create_square_poster(
            brand_name=p['brand_name'],
            industry=p['industry'],
            year=p['year'],
            category=p['category'],
            index_num=p['index_num']
        )
        img.save(out_path, format='JPEG', quality=95)

    print("\nAll 40 posters generated successfully in 1:1 Square format!")

    # 3. Update cache busters to ?v=65 across all HTML files
    print("\n=== Updating cache-busters across all HTML files to ?v=65 ===")
    target_files = [
        'index.html',
        'work.html',
        'product-base.html',
        'service-base.html',
        'brand-strategy.html',
        'marketing-communication.html',
        'visual-identity.html'
    ] + glob.glob('projects/*.html')

    pattern_jpg = re.compile(r'((?:(?:\.\./)?images/project-[a-z0-9\-]+\.jpg))(?:\?v=\d+)?')
    pattern_avif = re.compile(r'((?:(?:\.\./)?images/69[a-z0-9_\-]+\.avif))(?:\?v=\d+)?')

    total_updated = 0
    for file_path in target_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content, c1 = pattern_jpg.subn(r'\1?v=65', content)
        new_content, c2 = pattern_avif.subn(r'\1?v=65', new_content)

        if c1 + c2 > 0:
            total_updated += (c1 + c2)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

    print(f"Updated {total_updated} image references with ?v=65 cache buster across HTML files.")

if __name__ == '__main__':
    main()
