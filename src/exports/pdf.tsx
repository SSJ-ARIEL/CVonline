import { Document, Font, Image, Link, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { Fragment } from 'react';
import type { ResumeData, ResumeSettings } from '../model';
import { accentInkColor, accentTextColor, getTemplate } from '../templates';
import { cleanText, contactItems, downloadBlob, fileName, resumeLabels, resumeSections, safeAccent, safeFontSize, safePhoto, type ResumeSection } from '../resume-text';

// Fonts are built in; no personal data or rendering requests leave the browser.
Font.registerHyphenationCallback(word => word.length > 28 ? word.match(/.{1,22}/gu) ?? [word] : [word]);

function ResumePdf({data,settings}: {data:ResumeData;settings:ResumeSettings}) {
  const template = getTemplate(settings.templateId);
  const labels = resumeLabels(settings.locale);
  const sections = resumeSections(data,settings);
  const contacts = contactItems(data);
  const accent = safeAccent(settings.accent,template.accent);
  const inkAccent = accentInkColor(accent);
  const fontSize = safeFontSize(settings.fontSize);
  const fontFamily = template.font === 'serif' ? 'Times-Roman' : 'Helvetica';
  const boldFont = template.font === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';
  const photo = settings.showPhoto ? safePhoto(data.personal.photo) : undefined;
  const treatment = template.treatment;
  const isRail = treatment === 'rail' && template.columns === 2;
  const isPortfolio = treatment === 'portfolio';
  const isBand = template.header === 'band';
  const isCenter = template.header === 'center';
  const isFormal = treatment === 'formal';
  const railTextColor = accentTextColor(accent);
  const darkSidebar = isRail && railTextColor === '#ffffff';
  const sidebarColor = isRail ? railTextColor : '#4d5963';
  const sidebarHeadingColor = isRail ? railTextColor : inkAccent;
  const headerColor = accent;
  const headerTextColor = accentTextColor(headerColor);
  const pageWidth = settings.paper === 'LETTER' ? 612 : 595.28;
  const sidebarWidth = pageWidth * .29;
  const tintedSidebar = isPortfolio || (isBand && template.columns===2);
  const sidebarFill = isPortfolio ? '#f3eef0' : template.id==='canvas' ? '#f7f1ed' : '#f4f2ed';
  const styles = StyleSheet.create({
    page:{paddingTop:36,paddingBottom:36,paddingHorizontal:isRail?0:treatment==='frame'?48:isFormal?46.5:40.5,fontFamily,fontSize,lineHeight:template.density==='compact'?1.36:1.48,color:'#28313b'},
    frame:{position:'absolute',top:20,bottom:20,left:21,right:21,borderWidth:.7,borderColor:accent},
    railBackground:{position:'absolute',top:0,bottom:0,width:sidebarWidth,backgroundColor:accent,...(template.sidebar==='right'?{right:0}:{left:0})},
    header:{flexDirection:'row',alignItems:isPortfolio||treatment==='editorial'?'flex-start':'center',justifyContent:'space-between',paddingBottom:isBand?32:isFormal?15:19,marginBottom:isFormal?18:22,borderBottomWidth:isBand?0:isPortfolio||isFormal||isRail?1:template.header==='minimal'||template.header==='split'||treatment==='editorial'?0:1.5,borderBottomColor:accent,...(isBand?{backgroundColor:headerColor,paddingTop:32,paddingHorizontal:40.5,marginTop:-36,marginHorizontal:-40.5}:{}),...(template.header==='split'&&!isPortfolio?{borderLeftWidth:4,borderLeftColor:accent,paddingLeft:16}:{}),...(treatment==='editorial'?{borderTopWidth:.75,borderTopColor:accent,paddingTop:20}:{}),},
    identity:{flexGrow:1,flexShrink:1,textAlign:isCenter?'center':'left',paddingRight:photo&&!isRail?14:0},
    name:{fontFamily:isPortfolio?'Times-Roman':isFormal||treatment==='editorial'?fontFamily:boldFont,fontSize:isPortfolio?fontSize*4:isFormal?27:treatment==='editorial'?36:template.header==='minimal'?28:31,lineHeight:1.1,color:isBand?headerTextColor:isPortfolio||template.id==='muse'?inkAccent:'#172330',letterSpacing:isFormal?.2:-.7,marginBottom:8},
    headline:{color:isBand?headerTextColor:inkAccent,fontSize:fontSize+1.5,marginBottom:9},
    contacts:{flexDirection:'row',flexWrap:'wrap',justifyContent:isCenter?'center':'flex-start',gap:4},
    contact:{fontSize:fontSize-1.6,color:isBand?headerTextColor:'#59636c',marginRight:9,marginBottom:3,textDecoration:'none'},
    sidebarContact:{fontSize:fontSize-1,color:sidebarColor,marginBottom:7,textDecoration:'none'},
    photo:{width:isRail?88.5:isPortfolio?79.5:treatment==='editorial'?73.5:isCenter?63.75:66,height:isRail?104.25:isPortfolio?95.25:treatment==='editorial'?90.75:isCenter?63.75:75,objectFit:'cover',borderRadius:isCenter?32:1.5,...(isRail?{marginBottom:22.5,borderWidth:1.5,borderColor:railTextColor}:{}),},
    columns:{flexDirection:'row',gap:isRail?0:22,alignItems:'flex-start'},
    main:{flexGrow:1,flexShrink:1,width:template.columns===2?isRail?'71%':'68%':'100%',...(isRail?{paddingTop:1.5,paddingHorizontal:30}:{}),},
    sidebar:{width:isRail?'29%':'27%',flexGrow:0,flexShrink:0,...(isRail?{paddingHorizontal:19.5,paddingTop:.75,color:sidebarColor}:tintedSidebar?{paddingHorizontal:isPortfolio?15:12.75,paddingVertical:isPortfolio?17.25:15,backgroundColor:sidebarFill}:{paddingLeft:template.sidebar==='right'?14:0,paddingRight:template.sidebar==='left'?14:0,...(template.sidebar==='right'?{borderLeftWidth:.6,borderLeftColor:'#dde2e6'}:{borderRightWidth:.6,borderRightColor:'#dde2e6'})}),},
    section:{marginBottom:template.density==='compact'?14:19},
    sectionHeading:{fontFamily:boldFont,fontSize:fontSize-.1,color:inkAccent,textTransform:'uppercase',letterSpacing:template.sectionStyle==='caps'?1.35:.85,marginBottom:9,paddingBottom:template.sectionStyle==='line'?5:1,...(template.sectionStyle==='line'?{borderBottomWidth:.5,borderBottomColor:'#dce2e7'}:{}),...(template.sectionStyle==='bar'?{borderLeftWidth:2,borderLeftColor:accent,paddingLeft:7}:{}),},
    sidebarHeading:{color:sidebarHeadingColor,borderBottomColor:isRail?(darkSidebar?'#ffffff55':'#18212d55'):'#dce2e7'},
    entry:{marginBottom:template.density==='compact'?9:12},
    timelineEntry:{borderLeftWidth:.8,borderLeftColor:'#d7dfe4',paddingLeft:13,marginLeft:3},
    timelineDot:{position:'absolute',top:3,left:-3.3,width:5.5,height:5.5,borderRadius:3,backgroundColor:inkAccent},
    projectCard:{borderWidth:.65,borderColor:accent,padding:12,backgroundColor:'#fbfcfc'},
    editorialSummary:{paddingVertical:12,paddingHorizontal:14,borderLeftWidth:2.25,borderLeftColor:accent,backgroundColor:template.id==='muse'?'#f6f1f4':'#f7f5f2'},
    ledgerContent:{marginLeft:34.5},
    title:{fontFamily:boldFont,fontSize,color:'#1b2732',marginBottom:2},
    date:{fontSize:fontSize-1.5,color:'#626e78',marginBottom:4},
    subtitle:{fontSize:fontSize-.6,color:'#58636d',marginBottom:4},
    sideBody:{color:sidebarColor},
    sideTitle:{color:isRail?railTextColor:'#1b2732'},
    body:{marginBottom:4},
    bullet:{flexDirection:'row',marginBottom:3},
    bulletMark:{width:12,fontSize},
    bulletText:{flexGrow:1,flexShrink:1},
    link:{fontSize:fontSize-1,color:inkAccent,marginTop:3,textDecoration:'none'},
    tags:{fontSize:fontSize-.6,lineHeight:1.6},
    skillGrid:{flexDirection:'row',flexWrap:'wrap',gap:5},
    skill:{borderWidth:.5,borderColor:'#d8e0e4',paddingVertical:3,paddingHorizontal:7,fontSize:fontSize-.5},
    pageNumber:{position:'absolute',bottom:18,right:38,fontSize:7,color:isRail&&template.sidebar==='right'?sidebarColor:'#8a919a'},
  });
  const renderContact = (item: typeof contacts[number], index:number) => item.href
    ? <Link key={index} src={item.href} style={styles.contact}>{cleanText(item.text)}</Link>
    : <Text key={index} style={styles.contact}>{cleanText(item.text)}</Text>;
  const section = (item:ResumeSection, sidebar=false) => {
    const number = treatment==='ledger'?`${String(sections.findIndex(candidate=>candidate.id===item.id)+1).padStart(2,'0')}   `:'';
    const heading = `${number}${template.sectionStyle==='dot'?'· ':''}${cleanText(item.title)}`;
    const skillsPromoted = item.id==='skills' && !item.auxiliary && !sidebar;
    const headingNode = <Text style={[styles.sectionHeading,...(sidebar?[styles.sidebarHeading]:[])]} minPresenceAhead={22}>{heading}</Text>;
    const tags = item.id==='skills'||item.id==='interests';
    return <View key={item.id} style={[styles.section,...(treatment==='editorial'&&item.id==='summary'&&!sidebar?[styles.editorialSummary]:[])]} wrap>
      {(!isRail||tags)&&headingNode}
      {skillsPromoted ? <View style={[styles.skillGrid,...(treatment==='ledger'?[styles.ledgerContent]:[])]} wrap>{item.entries.map((entry,index)=><Text key={index} style={styles.skill}>{cleanText(entry.body??'')}</Text>)}</View>
      : item.id==='skills'||item.id==='interests' ? <Text style={[styles.tags,...(sidebar?[styles.sideBody]:[]),...(treatment==='ledger'?[styles.ledgerContent]:[])]} orphans={2} widows={2}>{item.entries.map(entry=>cleanText(entry.body??'')).join(' · ')}</Text>
      : item.entries.map((entry,index)=>{
        const timeline = treatment==='timeline' && ['experience','education','certifications'].includes(item.id) && !sidebar;
        const metadata = <>
          {entry.title&&<Text style={[styles.title,...(sidebar?[styles.sideTitle]:[])]}>{cleanText(entry.title)}</Text>}
          {entry.subtitle&&<Text style={[styles.subtitle,...(sidebar?[styles.sideBody]:[])]}>{cleanText(entry.subtitle)}</Text>}
          {entry.date&&<Text style={[styles.date,...(sidebar?[styles.sideBody]:[])]}>{cleanText(entry.date)}</Text>}
        </>;
        const body = <>
          {entry.body&&<Text style={[styles.body,...(sidebar?[styles.sideBody]:[])]} orphans={2} widows={2}>{cleanText(entry.body)}</Text>}
          {entry.bullets?.map((bullet,bulletIndex)=><View key={bulletIndex} style={styles.bullet} wrap><Text style={styles.bulletMark}>•</Text><Text style={styles.bulletText} orphans={2} widows={2}>{cleanText(bullet)}</Text></View>)}
          {entry.linkText&&(entry.link?<Link src={entry.link} style={[styles.link,...(sidebar&&isRail?[styles.sideBody]:[])]}>{cleanText(entry.linkText)}</Link>:<Text style={[styles.link,...(sidebar&&isRail?[styles.sideBody]:[])]}>{cleanText(entry.linkText)}</Text>)}
        </>;
        // Splitting metadata from flowing text keeps the section title beside
        // its first entry while either column continues across several pages.
        if(isRail)return <Fragment key={index}>
          <View wrap={false} minPresenceAhead={entry.body||entry.bullets?.length?22:0}>{index===0&&headingNode}{metadata}</View>
          <View style={styles.entry} wrap>{body}</View>
        </Fragment>;
        return <View key={index} style={[styles.entry,...(treatment==='ledger'?[styles.ledgerContent]:[]),...(timeline?[styles.timelineEntry]:[]),...((isPortfolio||template.id==='canvas')&&item.id==='projects'&&!sidebar?[styles.projectCard]:[])]} wrap>
          {timeline&&<View style={styles.timelineDot}/>}
          {timeline&&entry.date&&<Text style={styles.date}>{cleanText(entry.date)}</Text>}
          {entry.title && <Text style={[styles.title,...(sidebar?[styles.sideTitle]:[])]} minPresenceAhead={entry.body||entry.subtitle?14:0}>{cleanText(entry.title)}</Text>}
          {entry.subtitle && <Text style={[styles.subtitle,...(sidebar?[styles.sideBody]:[])]}>{cleanText(entry.subtitle)}</Text>}
          {!timeline&&entry.date && <Text style={[styles.date,...(sidebar?[styles.sideBody]:[])]}>{cleanText(entry.date)}</Text>}
          {body}
        </View>;
      })}
    </View>;
  };
  const header = <View style={styles.header} wrap>
    <View style={styles.identity}><Text style={styles.name}>{cleanText(data.personal.name)}</Text>{data.personal.headline&&<Text style={styles.headline}>{cleanText(data.personal.headline)}</Text>}{template.columns===1&&<View style={styles.contacts}>{contacts.map(renderContact)}</View>}</View>
    {photo&&!isRail&&<Image src={photo} style={styles.photo}/>}
  </View>;
  const primary = <View style={styles.main} wrap>{isRail&&header}{sections.filter(item=>!item.auxiliary).map(item=>section(item))}</View>;
  const auxiliary = <View style={styles.sidebar} wrap>
    {photo&&isRail&&<Image src={photo} style={styles.photo}/>}
    {!!contacts.length&&<View style={styles.section} wrap><Text style={[styles.sectionHeading,styles.sidebarHeading]} minPresenceAhead={22}>{labels.contact}</Text>{contacts.map((item,index)=>item.href?<Link key={index} src={item.href} style={styles.sidebarContact}>{cleanText(item.text)}</Link>:<Text key={index} style={styles.sidebarContact}>{cleanText(item.text)}</Text>)}</View>}
    {sections.filter(item=>item.auxiliary).map(item=>section(item,true))}
  </View>;
  return <Document title={data.personal.name?`${data.personal.name} — CVonline`:'CVonline'} author={data.personal.name || undefined} creator="CVonline" producer="CVonline">
    <Page size={settings.paper} style={styles.page} wrap>
      {treatment==='frame'&&<View fixed style={styles.frame}/>}
      {isRail&&<View fixed style={styles.railBackground}/>}
      {!isRail&&header}
      {template.columns===1?<View wrap>{sections.map(item=>section(item))}</View>:<View style={styles.columns} wrap>{template.sidebar==='left'?<>{auxiliary}{primary}</>:<>{primary}{auxiliary}</>}</View>}
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
