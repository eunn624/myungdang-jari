/* 공유 카드 — A형(귀여운 기본) + C형(명당 추천) 혼합 */

function ShareFrame({children, bg}){
  return (
    <div className="sk sk-2" style={{width:'100%', height:'100%', padding:'18px 16px', background:bg||'var(--pink-soft)', display:'flex', flexDirection:'column', gap:12, overflow:'hidden'}}>
      {children}
      <div className="row between vcenter" style={{marginTop:'auto'}}>
        <span className="t-xs muted">명당자리</span>
        <span className="t-xs muted">@명당자리</span>
      </div>
    </div>
  );
}

/* A. 귀여운 기본 카드 (마스코트 + 한 줄 성향 + 개운법) */
function ShareCute(){
  return (
    <ShareFrame>
      <div className="center"><span className="t-s muted">시은님의 명당자리</span></div>
      <div className="center"><Mascot s={88} pink style={{margin:'0 auto'}}/></div>
      <div className="center">
        <div className="h2">따뜻한 작은<br/>불꽃 같은 사람</div>
        <span className="chip pink" style={{marginTop:8}}>丁火 · 붉은 닭</span>
      </div>
      <div className="sk sk-thin" style={{padding:'10px', background:'var(--screen)'}}>
        <div className="t-s bold center" style={{marginBottom:8}}>추천 지역 · 수변 동네</div>
        <div className="row gap6" style={{justifyContent:'center', flexWrap:'wrap'}}>
          <span className="chip soft">물컵 두기</span><span className="chip soft">파란 소품</span><span className="chip soft">남쪽 정돈</span>
        </div>
      </div>
    </ShareFrame>
  );
}

/* C. 명당 추천 카드 (추천 지역 3개 + 개운 방향) */
function SharePlace(){
  return (
    <ShareFrame bg="#EAF0F6">
      <div className="center"><span className="t-s bold">시은님께 어울리는 동네</span></div>
      <div className="col gap6">
        {[['1. 옥수동','玉水洞','수변형'],['2. 여의도','汝矣島','섬형'],['3. 탄천로','炭川路','하천변']].map(([n,h,t])=>(
          <div key={n} className="sk sk-thin" style={{padding:'8px 10px', background:'var(--screen)', borderRadius:'8px'}}>
            <div className="t-xs bold">{n}</div>
            <div className="t-xs muted">{h} · {t}</div>
          </div>
        ))}
      </div>
      <div className="center" style={{marginTop:4}}>
        <span className="chip fill" style={{fontSize:12}}>대표 개운 · 남쪽</span>
      </div>
      <div className="t-xs center muted" style={{fontSize:10}}>지역별 상세는 앱에서</div>
    </ShareFrame>
  );
}

/* 혼합형 (한 카드에 기본+명당 정보 함께) */
function ShareMixed(){
  return (
    <ShareFrame bg="var(--pink-soft)">
      <div className="center"><span className="t-s" style={{color:'var(--ink-soft)'}}>시은님의 명당자리</span></div>
      <div className="center" style={{marginTop:4}}>
        <Mascot s={72} pink/>
      </div>
      <div className="center">
        <div className="h3">丁火 · 따뜻한 불꽃</div>
      </div>
      <div className="sk sk-thin" style={{padding:'8px', background:'var(--screen)', borderRadius:8}}>
        <div className="t-xs bold" style={{marginBottom:4}}>어울리는 지역</div>
        <div className="row gap4" style={{flexWrap:'wrap', gap:3}}>
          {['옥수동','여의도','탄천로'].map(x=><span key={x} className="chip soft" style={{fontSize:11}}>{x}</span>)}
        </div>
      </div>
      <div className="row gap6" style={{justifyContent:'center', flexWrap:'wrap'}}>
        <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF', fontSize:11}}>💧 물</span>
        <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF', fontSize:11}}>💙 파랑</span>
        <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF', fontSize:11}}>🧭 남쪽</span>
      </div>
    </ShareFrame>
  );
}

Object.assign(window, { ShareCute, ShareMixed, SharePlace });
