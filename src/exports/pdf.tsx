import { Document, Font, Image, Link, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import type { ResumeData, ResumeSettings } from '../model';
import { getTemplate } from '../templates';
import { cleanText, contactItems, downloadBlob, fileName, resumeLabels, resumeSections, safeAccent, safeFontSize, safePhoto, type ResumeSection } from '../resume-text';

// Keep very long user-supplied words and URLs inside their column without
// fetching fonts or sending personal data to a rendering service.
Font.registerHyphenationCallback(word => word.length > 28 ? word.match(/.{1,22}/gu) ?? [word] : [word]);

function ResumePdf({data,settings}: {data:ResumeData;settings:ResumeSettings}) {
  const template = getTemplate(settings.templateId);
  const labels = resumeLabels(settings.locale);
  const sections = resumeSections(data,settings);
  const contacts = contactItems(data);
  const accent = safeAccent(settings.accent,template.accent);
  const fontSize = safeFontSize(settings.fontSize);
  const fontFamily = template.font === 'serif' ? 'Times-Roman' : 'Helvetica';
  const boldFont = template.font === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';
  const lineHeight = template.density === 'compact' ? 1.36 : 1.48;
  const photo = settings.showPhoto ? safePhoto(data.personal.photo) : undefined;
  const isBand = template.header === 'band';
  const isCenter = template.header === 'center';
  const styles = StyleSheet.create({
    page:{paddingTop:36,paddingBottom:36,paddingHorizontal:38,fontFamily,fontSize,lineHeight,color:'#28313b'},
    header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:isBand?22:18,marginBottom:21,borderBottomWidth:template.header==='minimal'||template.header==='split'||isBand?0:template.id==='prism'?3:1.5,borderBottomColor:accent,...(isBand?{backgroundColor:accent,paddingTop:24,paddingHorizontal:38,marginTop:-36,marginHorizontal:-38}:{}),...(template.header==='split'?{borderLeftWidth:4,borderLeftColor:accent,paddingLeft:15}:{}),},
    identity:{flexGrow:1,flexShrink:1,textAlign:isCenter?'center':'left',paddingRight:photo?14:0},
    name:{fontFamily:template.font==='serif'&&(template.family==='executive'||template.family==='creative')?fontFamily:boldFont,fontSize:template.header==='minimal'?27:31,lineHeight:1.12,color:isBand?'#ffffff':'#172330',letterSpacing:-.7,marginBottom:7},
    headline:{color:isBand?'#ffffff':accent,fontSize:fontSize+1.5,marginBottom:9},
    contacts:{flexDirection:'row',flexWrap:'wrap',justifyContent:isCenter?'center':'flex-start',gap:4},
    contact:{fontSize:fontSize-1.7,color:isBand?'#ffffff':'#59636c',marginRight:9,marginBottom:3,textDecoration:'none'},
    sidebarContact:{fontSize:fontSize-1,color:'#59636c',marginBottom:6,textDecoration:'none'},
    photo:{width:64,height:64,objectFit:'cover',borderRadius:isCenter||isBand||template.id==='prism'||template.id==='nova'?32:3},
    columns:{flexDirection:'row',gap:22,alignItems:'flex-start'},
    main:{flexGrow:1,flexShrink:1,width:template.columns===2?'68%':'100%'},
    sidebar:{width:'29%',flexGrow:0,flexShrink:0,paddingLeft:template.sidebar==='right'?14:0,paddingRight:template.sidebar==='left'?14:0,...(template.sidebar==='right'?{borderLeftWidth:.6,borderLeftColor:'#dde2e6'}:{borderRightWidth:.6,borderRightColor:'#dde2e6'})},
    section:{marginBottom:template.density==='compact'?13:18},
    sectionHeading:{fontFamily:boldFont,fontSize:fontSize-0.1,color:accent,textTransform:'uppercase',letterSpacing:template.sectionStyle==='caps'?1.35:.85,marginBottom:9,paddingBottom:template.sectionStyle==='line'?5:1,...(template.sectionStyle==='line'?{borderBottomWidth:.5,borderBottomColor:'#dce2e7'}:{}),...(template.sectionStyle==='bar'?{borderLeftWidth:2,borderLeftColor:accent,paddingLeft:7}:{}),},
    entry:{marginBottom:template.density==='compact'?8:11},
    title:{fontFamily:boldFont,fontSize,color:'#1b2732',marginBottom:2},
    date:{fontSize:fontSize-1.5,color:'#626e78',marginBottom:3},
    subtitle:{fontSize:fontSize-0.6,color:'#58636d',marginBottom:4},
    body:{marginBottom:4},
    bullet:{flexDirection:'row',marginBottom:3},
    bulletMark:{width:12,fontSize},
    bulletText:{flexGrow:1,flexShrink:1},
    link:{fontSize:fontSize-1,color:accent,marginTop:3,textDecoration:'none'},
    tags:{fontSize:fontSize-0.6,lineHeight:1.55},
    pageNumber:{position:'absolute',bottom:18,right:38,fontSize:7,color:'#8a919a'},
  });
  const renderContact = (item: typeof contacts[number], index:number) => item.href
    ? <Link key={index} src={item.href} style={styles.contact}>{cleanText(item.text)}</Link>
    : <Text key={index} style={styles.contact}>{cleanText(item.text)}</Text>;
  const section = (item:ResumeSection) => <View key={item.id} style={styles.section} wrap>
    <Text style={styles.sectionHeading} minPresenceAhead={18}>{template.sectionStyle==='dot'?'· ':''}{cleanText(item.title)}</Text>
    {item.id==='skills'||item.id==='interests' ? <Text style={styles.tags} orphans={2} widows={2}>{item.entries.map(entry=>cleanText(entry.body??'')).join(' · ')}</Text> : item.entries.map((entry,index)=><View key={index} style={styles.entry} wrap>
      {entry.title && <Text style={styles.title} minPresenceAhead={entry.body||entry.subtitle?13:0}>{cleanText(entry.title)}</Text>}
      {entry.subtitle && <Text style={styles.subtitle}>{cleanText(entry.subtitle)}</Text>}
      {entry.date && <Text style={styles.date}>{cleanText(entry.date)}</Text>}
      {entry.body && <Text style={styles.body} orphans={2} widows={2}>{cleanText(entry.body)}</Text>}
      {entry.bullets?.map((bullet,bulletIndex)=><View key={bulletIndex} style={styles.bullet} wrap><Text style={styles.bulletMark}>•</Text><Text style={styles.bulletText} orphans={2} widows={2}>{cleanText(bullet)}</Text></View>)}
      {entry.linkText && (entry.link?<Link src={entry.link} style={styles.link}>{cleanText(entry.linkText)}</Link>:<Text style={styles.link}>{cleanText(entry.linkText)}</Text>)}
    </View>)}
  </View>;
  const primary = <View style={styles.main} wrap>{sections.filter(item=>!item.auxiliary).map(section)}</View>;
  const auxiliary = <View style={styles.sidebar} wrap>{!!contacts.length&&<View style={styles.section} wrap><Text style={styles.sectionHeading} minPresenceAhead={18}>{labels.contact}</Text>{contacts.map((item,index)=>item.href?<Link key={index} src={item.href} style={styles.sidebarContact}>{cleanText(item.text)}</Link>:<Text key={index} style={styles.sidebarContact}>{cleanText(item.text)}</Text>)}</View>}{sections.filter(item=>item.auxiliary).map(section)}</View>;
  return <Document title={data.personal.name?`${data.personal.name} — CVonline`:'CVonline'} author={data.personal.name || undefined} creator="CVonline" producer="CVonline">
    <Page size={settings.paper} style={styles.page} wrap>
      <View style={styles.header} wrap>
        <View style={styles.identity}><Text style={styles.name}>{cleanText(data.personal.name)}</Text>{data.personal.headline&&<Text style={styles.headline}>{cleanText(data.personal.headline)}</Text>}{template.columns===1&&<View style={styles.contacts}>{contacts.map(renderContact)}</View>}</View>
        {photo && <Image src={photo} style={styles.photo}/>}
      </View>
      {template.columns===1?<View wrap>{sections.map(section)}</View>:<View style={styles.columns} wrap>{template.sidebar==='left'?<>{auxiliary}{primary}</>:<>{primary}{auxiliary}</>}</View>}
      <Text fixed style={styles.pageNumber} render={({pageNumber,totalPages})=>totalPages>1?`${pageNumber} / ${totalPages}`:''}/>
    </Page>
  </Document>;
}

export async function createPdfBlob(data:ResumeData,settings:ResumeSettings):Promise<Blob> {
  return pdf(<ResumePdf data={data} settings={settings}/>).toBlob();
}
export async function downloadPdf(data:ResumeData,settings:ResumeSettings):Promise<void> {
  downloadBlob(await createPdfBlob(data,settings),fileName(data,'pdf'));
}
