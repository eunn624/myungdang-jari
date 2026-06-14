/* 시작 플로우: 온보딩 → 입력 → 분석 로딩 */

function Onb1(){
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:18, paddingBottom:20}}>
        <div className="row between vcenter">
          <span className="h-app">명당자리</span>
          <span className="t-xs muted">건너뛰기</span>
        </div>
        <div className="g1 col" style={{justifyContent:'center', gap:14}}>
          <ImgPH label={'공간 일러스트\n방 · 창가 · 식물'} h={150}/>
          <div style={{marginTop:6}}>
            <div className="h1">조용한 방 안에도<br/>나만의 기운이 흘러요</div>
            <Lines rows={['w90','w70']} style={{marginTop:12}}/>
          </div>
        </div>
        <Mascot s={56} pink cls="" />
        <div className="dotsrow"><span className="dot on"></span><span className="dot"></span><span className="dot"></span></div>
        <div className="btn pri">시작하기</div>
        <Note>온보딩 1 · 감각적 초대 (캐릭터+공간 오브제)</Note>
      </div>
    </Phone>
  );
}

function Onb2(){
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:18, paddingBottom:20}}>
        <div className="t-xs muted" style={{textAlign:'right'}}>건너뛰기</div>
        <div className="g1 col" style={{justifyContent:'center', gap:16}}>
          <div className="center"><Mascot s={84} cls="" style={{margin:'0 auto'}}/></div>
          <ImgPH label="약속 일러스트 · 손 내밀기" h={92}/>
          <div className="center">
            <div className="h1">명당자리는<br/>공간 가이드예요</div>
          </div>
        </div>
        <div className="dotsrow"><span className="dot"></span><span className="dot on"></span><span className="dot"></span></div>
        <div className="btn pri">알겠어요</div>
        <Note>온보딩 2 · 참고용 최소화</Note>
      </div>
    </Phone>
  );
}

function Onb3(){
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:18, paddingBottom:20}}>
        <div className="t-xs muted" style={{textAlign:'right'}}>건너뛰기</div>
        <div className="g1 col" style={{justifyContent:'center', gap:16}}>
          <div className="center" style={{fontSize:54}}>
            <div className="sk" style={{width:90, height:90, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%'}}>
              <div className="t-s center">자물쇠<br/>아이콘</div>
            </div>
          </div>
          <div className="center">
            <div className="h1">생년월일시는<br/>분석에만 사용돼요</div>
            <Lines rows={['w80','w60']} style={{marginTop:12, alignItems:'center'}}/>
          </div>
          <div className="sk sk-thin" style={{padding:'10px 12px'}}>
            <div className="t-s">🔒 외부 공유·광고에 쓰지 않아요</div>
          </div>
        </div>
        <div className="dotsrow"><span className="dot"></span><span className="dot"></span><span className="dot on"></span></div>
        <div className="btn pri">내 정보 입력하기</div>
        <Note>온보딩 3 · 입력 불안 완화</Note>
      </div>
    </Phone>
  );
}

function InputScreen(){
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:14, paddingBottom:18, gap:11}}>
        <div className="row vcenter gap8"><span className="h3">←</span><span className="t-xs muted">3 / 4</span></div>
        <div className="h2">기본 정보를 알려주세요</div>

        <div className="col gap6">
          <span className="t-s bold">이름 · 닉네임</span>
          <div className="sk" style={{padding:'10px 12px'}}><span className="t muted">시은</span></div>
        </div>

        <div className="col gap6">
          <span className="t-s bold">성별</span>
          <div className="row gap8">
            <div className="sk g1 center" style={{padding:'9px'}}><span className="t">여성</span></div>
            <div className="sk sk-dash g1 center" style={{padding:'9px'}}><span className="t muted">남성</span></div>
          </div>
        </div>

        <div className="col gap6">
          <span className="t-s bold">양력 / 음력</span>
          <div className="row gap8">
            <div className="sk g1 center" style={{padding:'9px', background:'var(--accent-soft)', borderColor:'var(--accent)'}}><span className="t accent bold">양력</span></div>
            <div className="sk sk-dash g1 center" style={{padding:'9px'}}><span className="t muted">음력</span></div>
          </div>
        </div>

        <div className="col gap6">
          <span className="t-s bold">생년월일</span>
          <div className="sk row between vcenter" style={{padding:'10px 12px'}}>
            <span className="t">1997 . 06 . 24</span><span className="t-xs muted">▾</span>
          </div>
        </div>

        <div className="col gap6">
          <span className="t-s bold">출생 시간</span>
          <div className="sk row between vcenter" style={{padding:'10px 12px'}}>
            <span className="t">오전 10 : 47</span><span className="t-xs muted">▾</span>
          </div>
          <div className="row vcenter gap6"><span className="chip soft">⬚ 시간 모름</span><span className="t-xs muted">모르면 3주 기준으로 분석해요</span></div>
        </div>

        <div className="g1"></div>
        <div className="btn pri">분석 시작하기</div>
        <Note>입력 · 한 화면에 정리, 시 모름 옵션 포함</Note>
      </div>
    </Phone>
  );
}

function LoadingScreen(){
  const steps=['사주팔자를 정리하는 중','오행의 균형을 읽는 중','지명과 지형을 맞춰보는 중','침대 방향 가이드를 준비하는 중'];
  return (
    <Phone>
      <div className="ph-body" style={{paddingTop:18, paddingBottom:24, justifyContent:'center', gap:22}}>
        <div className="center"><Mascot s={96} pink style={{margin:'0 auto'}}/></div>
        <div className="center">
          <div className="h1">시은님의 기운을<br/>읽고 있어요</div>
        </div>
        <div className="col gap10" style={{marginTop:4}}>
          {steps.map((s,i)=>(
            <div key={i} className="row vcenter gap8">
              <div className="sk" style={{width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:i<2?'var(--accent-soft)':'var(--screen)', borderColor:i<2?'var(--accent)':'var(--ph-line)'}}>
                <span className="t-xs" style={{color:i<2?'var(--accent)':'var(--ink-faint)'}}>{i<2?'✓':'○'}</span>
              </div>
              <span className="t" style={{color:i<2?'var(--ink)':'var(--ink-faint)'}}>{s}</span>
            </div>
          ))}
        </div>
        <div className="sk" style={{height:10, padding:0, overflow:'hidden'}}>
          <div style={{width:'55%', height:'100%', background:'var(--accent)'}}></div>
        </div>
        <Note>분석 로딩 · 단계별 안내로 기대감 형성</Note>
      </div>
    </Phone>
  );
}

Object.assign(window, { Onb1, Onb2, Onb3, InputScreen, LoadingScreen });
