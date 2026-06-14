/* 분석 결과 — 3가지 변형 (핵심 비교 축) */

const READINGS = [
  ['01','시은님의 사주팔자','丁丑 · 丙午 · 丁酉 · 乙巳'],
  ['02','일간 丁火 — 나의 중심','따뜻하게 빛나는 작은 불꽃'],
  ['03','오행 균형','火가 강하고 水가 비어 있어요'],
  ['04','신살 · 길성과 사주관계','도화살 · 반안살 읽기'],
  ['05','대운 · 세운 흐름','24세 대운, 2026 세운'],
  ['06','참고해볼 지역 · 명당','水를 보완하는 수변 동네'],
  ['07','개운법 & 공유 카드','오늘부터 해볼 5가지'],
];

/* A. 카드 스와이프 — 한 장씩 넘기기 (최종 방식) */
function ResultSwipe(){
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:14, paddingBottom:18, gap:12}}>
        <div className="row between vcenter">
          <span className="t-xs muted">3 / 7</span>
          <span className="h3 muted">✕</span>
        </div>
        <div className="dotsrow">
          {READINGS.map((r,i)=><span key={i} className={"dot"+(i===2?' on':'')}></span>)}
        </div>

        <div className="sk sk-2 g1 col" style={{padding:'18px 16px', gap:14, justifyContent:'flex-start'}}>
          <span className="chip fill" style={{alignSelf:'flex-start'}}>03 · 오행</span>
          <div className="h1">火가 강하고<br/>水가 비어 있어요</div>
          <Lines rows={['w90','w80','w90']} style={{marginTop:8}}/>
          <div className="bars" style={{marginTop:10, height:48}}>
            <Bars data={[
              {label:'木',pct:30},{label:'火',pct:92,fire:true},{label:'土',pct:34},
              {label:'金',pct:26},{label:'水',pct:14},
            ]}/>
          </div>
          <div className="sk sk-thin" style={{padding:'10px', marginTop:8, background:'var(--accent-soft)', borderColor:'var(--accent)'}}>
            <span className="t-s" style={{color:'var(--accent)', fontWeight:700}}>💡 공간에서 水 기운을 더해보면 좋아요</span>
            <div className="t-xs muted" style={{marginTop:4}}>침대 남쪽, 수변 지역, 파란 소품</div>
          </div>
        </div>

        <div className="row between vcenter">
          <span className="btn sm ghost">← 이전</span>
          <span className="t-xs muted">옆으로 넘기세요</span>
          <span className="btn sm pri">다음 →</span>
        </div>
        <Note>확정 · A형 카드 스와이프 (몰입형, 한 장씩)</Note>
      </div>
    </Phone>
  );
}

/* B. 세로 스크롤 — 한 페이지에 전부 */
function ResultScroll(){
  const Section=({n,title,sub,children,active})=>(
    <div className="col gap8" style={{paddingBottom:14, borderBottom:'1.6px dashed var(--ph-line)'}}>
      <div className="row vcenter gap8">
        <div className="chip" style={{width:30, height:30, padding:0, justifyContent:'center', borderRadius:'50%'}}>{n}</div>
        <div className="col"><span className="h3">{title}</span><span className="t-xs muted">{sub}</span></div>
      </div>
      {children}
    </div>
  );
  return (
    <Phone>
      <div className="ph-screen">
        <div className="row between vcenter" style={{padding:'10px 16px 8px', borderBottom:'2px solid var(--ink)'}}>
          <span className="h3">시은님의 리딩</span>
          <span className="t-xs muted">스크롤 ↓</span>
        </div>
        <div className="ph-body" style={{paddingTop:14, paddingBottom:16, gap:14}}>
          <Section n="01" title="사주팔자" sub="丁丑 · 丙午 · 丁酉 · 乙巳">
            <div className="row gap6">
              {['丁丑','丙午','丁酉','乙巳'].map(x=><div key={x} className="sk sk-thin g1 center" style={{padding:'7px 0'}}><span className="han" style={{fontSize:15, fontWeight:700}}>{x}</span></div>)}
            </div>
          </Section>
          <Section n="02" title="일간 丁火 — 나의 중심" sub="따뜻한 작은 불꽃">
            <Lines rows={['w90','w70']}/>
          </Section>
          <Section n="03" title="오행 균형" sub="火 강 · 水 부족">
            <div className="bars"><Bars data={[{label:'木',pct:30},{label:'火',pct:90,fire:true},{label:'土',pct:34},{label:'金',pct:26},{label:'水',pct:14}]}/></div>
          </Section>
          <Section n="04" title="신살 · 길성" sub="도화살 · 반안살">
            <div className="row gap6"><span className="chip pink">도화살</span><span className="chip">반안살</span></div>
          </Section>
          <div className="t-xs muted center">⋯ 05 대운·세운 · 06 명당 · 07 개운법 계속 ⋯</div>
        </div>
        <Note>변형 B · 세로 스크롤 (한 흐름에 7장 모두)</Note>
      </div>
    </Phone>
  );
}

/* C. 챕터 인덱스 — 목차 허브에서 골라 보기 */
function ResultIndex(){
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:14, paddingBottom:16, gap:12}}>
        <div className="row between vcenter"><span className="h3">←</span><span className="t-xs muted">내 리딩</span><span style={{width:14}}></span></div>

        <div className="sk sk-2" style={{padding:'14px', background:'var(--accent-soft)', borderColor:'var(--accent)'}}>
          <div className="row gap10 vcenter">
            <Mascot s={54} pink/>
            <div className="col">
              <span className="h3">시은 · 丁火 · 붉은 닭</span>
              <span className="t-s muted">7장의 공간 리딩이 준비됐어요</span>
            </div>
          </div>
        </div>

        <div className="col gap8 g1">
          {READINGS.map((r,i)=>(
            <div key={i} className="sk sk-thin row vcenter gap10" style={{padding:'9px 11px'}}>
              <div className="chip" style={{width:26, height:26, padding:0, justifyContent:'center', borderRadius:'50%', fontSize:11}}>{r[0]}</div>
              <div className="col g1"><span className="t bold">{r[1]}</span><span className="t-xs muted">{r[2]}</span></div>
              <span className="t-xs" style={{color:i<1?'var(--ink-faint)':'var(--accent)'}}>{i<1?'읽음':'›'}</span>
            </div>
          ))}
        </div>
        <Note>변형 C · 챕터 인덱스 (목차에서 골라 보는 허브)</Note>
      </div>
    </Phone>
  );
}

Object.assign(window, { ResultSwipe, ResultScroll, ResultIndex });
