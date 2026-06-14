import os
import re

# Define replacement mappings for css files and tsx code.
replacements = [
    # Backgrounds & Text
    ('style={{ backgroundColor: "#020817" }}', 'style={{ backgroundColor: "#FFFFFF" }}'),
    ('style={{ backgroundColor: \'#020817\' }}', 'style={{ backgroundColor: "#FFFFFF" }}'),
    ('style={{ backgroundColor: "#020817", minHeight: "100vh" }}', 'className="bg-white min-h-screen text-neutral-900"'),
    ('style={{ backgroundColor: \'#020817\', minHeight: \'100vh\' }}', 'className="bg-white min-h-screen text-neutral-900"'),
    ('className="min-h-screen relative" style={{ backgroundColor: "#020817" }}', 'className="min-h-screen bg-white text-neutral-900 relative"'),
    ('className="min-h-screen relative" style={{ backgroundColor: \'#020817\' }}', 'className="min-h-screen bg-white text-neutral-900 relative"'),
    ('bg-[#020817]', 'bg-white'),
    ('bg-zinc-950', 'bg-white'),
    ('bg-zinc-900', 'bg-neutral-50'),
    ('bg-[#141B2E]', 'bg-white'),
    ('bg-[#0F172A]', 'bg-white'),
    ('bg-black', 'bg-white'),
    ('text-white', 'text-neutral-900'),
    ('text-zinc-100', 'text-neutral-900'),
    ('text-zinc-200', 'text-neutral-850'),
    ('text-zinc-300', 'text-neutral-700'),
    ('text-zinc-400', 'text-neutral-500'),
    ('text-slate-100', 'text-neutral-900'),
    ('text-slate-200', 'text-neutral-850'),
    ('text-slate-300', 'text-neutral-700'),
    ('text-slate-400', 'text-neutral-550'),
    ('text-gray-255', 'text-neutral-900'),
    ('text-gray-100', 'text-neutral-900'),
    ('text-gray-200', 'text-neutral-850'),
    ('text-gray-300', 'text-neutral-700'),
    ('text-gray-400', 'text-neutral-550'),
    ('text-slate-500', 'text-neutral-500'),
    ('text-zinc-500', 'text-neutral-500'),
    ('text-slate-600', 'text-neutral-400'),
    
    # Borders
    ('border-zinc-800', 'border-neutral-200'),
    ('border-zinc-700', 'border-neutral-200'),
    ('border-slate-800', 'border-neutral-200'),
    ('border-slate-700', 'border-neutral-200'),
    ('border-white/10', 'border-neutral-200'),
    ('border-white/5', 'border-neutral-200'),
    ('border-white/20', 'border-neutral-200'),
    ('border-[#334155]', 'border-neutral-200'),
    ('border-neutral-800', 'border-neutral-200'),
    ('rgba(255,255,255,0.05)', '#E5E5E5'),
    ('rgba(255,255,255,0.08)', '#E5E5E5'),
    ('rgba(255,255,255,0.1)', '#E5E5E5'),
    ('rgba(255,255,255,0.06)', '#E5E5E5'),
    ('rgba(255,255,255,0.07)', '#E5E5E5'),
    ('rgba(255,255,255,0.12)', '#E5E5E5'),
    ('rgba(255,255,255,0.15)', '#E5E5E5'),

    # Fonts
    ('font-sora', 'font-heading'),
    ('font-geist', 'font-sans'),
    ('font-bold text-white', 'font-medium text-neutral-900 font-heading'),
    ('font-bold', 'font-medium'), # headings
    ('font-black', 'font-semibold'), # bold typography

    # Accent classes
    ('text-gold', 'text-neutral-900'),
    ('text-violet-grad', 'text-neutral-900'),
    ('text-brand', 'text-neutral-900'),
    ('shadow-[0_0_20px_rgba(255,255,255,0.2)]', 'shadow-xs'),
    ('shadow-[0_0_40px_rgba(236,72,153,0.4)]', 'shadow-xs'),
    ('shadow-[0_0_30px_rgba(255,255,255,0.3)]', 'shadow-xs'),
]

folders = ['app', 'components', 'sections']

def refactor_file(file_path):
    print(f"Refactoring: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified_content = content
    # Perform standard string replacements
    for orig, rep in replacements:
        modified_content = modified_content.replace(orig, rep)
        
    # Perform a few regex-based replacements for colors and styling
    # 1. replace background radial gradients or ambient blobs in components inline styles
    modified_content = re.sub(
        r'radial-gradient\(circle,\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d\.]+\)\s*0%,\s*transparent\s*70%\)',
        'none',
        modified_content
    )
    
    # 2. Replace absolute dark background/text color patterns
    modified_content = modified_content.replace('backgroundColor: "#020817"', 'backgroundColor: "#FFFFFF"')
    modified_content = modified_content.replace('bg-[#020817]', 'bg-white')
    modified_content = modified_content.replace('border-slate-800', 'border-neutral-200')
    
    # 3. Clean up backdrop/glow patterns from classes
    modified_content = re.sub(r'shadow-\[0_0_[\d\w_#,\(\)\./]+\]', 'shadow-xs', modified_content)
    
    if modified_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        print(f"Updated: {file_path}")

def run():
    for folder in folders:
        for root, dirs, files in os.walk(folder):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.jsx'):
                    # Skip files already redesigned
                    rel_path = os.path.join(root, file)
                    if 'app\\page.tsx' in rel_path or 'Navbar.tsx' in rel_path or 'personal-landing.tsx' in rel_path or 'artist-profile.tsx' in rel_path:
                        continue
                    refactor_file(rel_path)

if __name__ == '__main__':
    run()
