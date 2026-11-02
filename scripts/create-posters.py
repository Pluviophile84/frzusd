"""Generate standalone outlined Manrope poster SVGs; requires fonttools[woff]."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
import re
font=instantiateVariableFont(TTFont('public/fonts/manrope-latin-wght-normal.woff2'),{'wght':650},inplace=False)
glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); units=font['head'].unitsPerEm
logo=Path('public/brand/Frozen-USD-Master.svg').read_text()
logo=re.sub(r'<\?xml[^>]+>','',logo).replace('width="1024" height="1024"','width="80" height="80" x="52" y="48"')
def text(s,x,y,size,color):
 out=[]
 for c in s:
  name=cmap.get(ord(c),'space'); glyph=glyphs[name]; pen=SVGPathPen(glyphs);glyph.draw(pen)
  out.append(f'<path d="{pen.getCommands()}" transform="translate({x} {y}) scale({size/units} {-size/units})" fill="{color}"/>');x+=glyph.width*size/units
 return ''.join(out)
for i,(slug,lines,bg,fg,sub) in enumerate([
 ('frozen-still-moving',['FROZEN.','STILL','MOVING.'],'#79DAFF','#071827','THE DOLLAR THAT TRADES FROZEN.'),
 ('your-keys-our-freezer',['YOUR KEYS.','OUR','FREEZER.'],'#071827','#FFFFFF','DECENTRALIZED UNTIL FURTHER NOTICE.'),
 ('no-thawing-required',['NO','THAWING','REQUIRED.'],'#F2F8FC','#071827','A NEW STANDARD IN FROZEN FINANCE.')]):
 out=f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900" role="img" aria-label="{" ".join(lines)}"><rect width="720" height="900" fill="{bg}"/>'+logo
 out+=text('Frozen USD',420,92,24,fg)
 if i==0:
  out+='<g stroke="#071827" fill="none" opacity=".25"><ellipse cx="480" cy="650" rx="270" ry="80" transform="rotate(-25 480 650)"/><ellipse cx="480" cy="650" rx="215" ry="60" transform="rotate(-25 480 650)"/></g><path d="M520 660h100m-24-24 24 24-24 24" fill="none" stroke="#071827" stroke-width="5"/>'
 elif i==1:
  out+='<g fill="none" stroke="#79DAFF" stroke-width="2"><rect x="480" y="567" width="140" height="145" rx="5"/><path d="M510 567v-30a40 40 0 0 1 80 0v30M550 620v40"/></g>'
 else:
  out+='<g fill="#79DAFF" fill-opacity=".5" stroke="#005570"><path d="m465 570 125-35 65 60-125 40zM465 570v110l65 60V635m0 105 125-45V595"/></g>'
 for j,line in enumerate(lines):out+=text(line,52,300+j*112,85 if i!=1 else 78,fg)
 out+=f'<path d="M52 770H668" stroke="{fg}" opacity=".35"/>'
 out+=text(sub,52,808,16,fg)+text('$FUSD / MEMECOIN PARODY',52,851,14,fg)+text(f'0{i+1}',637,851,14,fg)+'</svg>'
 Path(f'public/media/{slug}.svg').write_text(out)
# Social source uses outlined type and the unchanged emblem; PNG is rendered once locally.
svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F2F8FC"/>'+logo
svg+=text('Frozen USD',150,100,26,'#071827')+text('Frozen.',52,285,100,'#071827')+text('Still moving.',52,395,100,'#071827')+text('The dollar that trades frozen.',56,490,29,'#526777')+text('$FUSD / MEMECOIN PARODY',56,575,16,'#071827')
art=Path('public/media/frozen-dollar.svg').read_text().replace('width="620" height="620"','x="695" y="65" width="500" height="500"',1)
svg+=art+'</svg>';Path('public/media/social.svg').write_text(svg)
