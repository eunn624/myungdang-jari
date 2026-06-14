/* 메인 5개 탭: 홈 · 사주원국 · 풀이 · 명당 · 마이 */

/* ---------- 1. 홈 — 상세화 ---------- */
function TabHome(){
  return (
    <Phone tab="home">
      <div className="ph-body" style={{paddingTop:12, paddingBottom:14, gap:12}}>
        <div className="row between vcenter">
          <div className="col"><span className="t-s muted">2026 · 06 · 14 · 목</span><span className="h2">시은님,<br/>좋은 아침이에요</span></div>
          <Mascot s={50} pink/>
        </div>

        {/* 데일리 리딩 카드 */}
        <div className="sk sk-2" style={{padding:'14px', background:'var(--accent-soft)', borderColor:'var(--accent)'}}>
          <div className="row between vcenter"><span className="t-s bold accent">오늘의 기운</span></div>
          <div className="h2" style={{marginTop:6, color:'var(--accent)'}}>火가 잘 도는 날</div>
          <Lines rows={['w80','w60']} style={{marginTop:8}}/>
          <div className="row gap6" style={{marginTop:10}}>
            <span className="chip fill">오늘 컬러 · 코랄</span>
            <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF'}}>물 마시기</span>
          </div>
        </div>

        {/* 오늘의 공간 미션 (가장 큰 CTA) */}
        <div className="sk sk-2" style={{padding:'14px', borderColor:'var(--ink)', borderWidth:'2px'}}>
          <span className="chip fill" style={{alignSelf:'flex-start'}}>오늘의 공간 미션</span>
          <div className="t" style={{margin:'10px 0', fontWeight:700, fontSize:15, lineHeight:1.4}}>창가에 물컵이나 작은 화병을 올려두기</div>
          <div className="t-xs muted" style={{marginBottom:10}}>水 기운을 아침 햇빛과 함께 받으세요</div>
          <div className="btn pri sm">미션 완료 체크 ✓</div>
        </div>

        {/* 최근 분석 바로가기 */}
        <div className="col gap6">
          <span className="t-s bold">이어서 보기</span>
          <div className="sk sk-thin row vcenter gap10" style={{padding:'9px 11px'}}>
            <div className="imgph" style={{width:38, height:38, flex:'0 0 38px', marginRight:0}}></div>
            <div className="col g1"><span className="t bold">내 사주 다시 보기</span><span className="t-xs muted">丁火 · 오행 리딩</span></div>
            <span className="t-xs accent">›</span>
          </div>
        </div>

        {/* 추천 액션 (명당/개운법/소품) */}
        <span className="t-s bold">오늘 추천</span>
        <div className="row gap8">
          <div className="sk sk-thin g1 col" style={{padding:'11px', gap:8, alignItems:'flex-start'}}>
            <span className="chip soft">명당 후보</span>
            <div className="t-xs" style={{flex:1}}>옥수동, 여의도</div>
            <span className="t-xs accent" style={{alignSelf:'flex-end'}}>›</span>
          </div>
          <div className="sk sk-thin g1 col" style={{padding:'11px', gap:8, alignItems:'flex-start'}}>
            <span className="chip soft">쇼핑</span>
            <div className="t-xs" style={{flex:1}}>파란 쿠션, 물 분무기</div>
            <span className="t-xs accent" style={{alignSelf:'flex-end'}}>›</span>
          </div>
        </div>
        <Note>홈 · 데일리 대시보드 (미션+추천 강조, 참고용 텍스트 최소)</Note>
      </div>
    </Phone>
  );
}

/* ---------- 2. 사주원국 (만세력 표) ---------- */
function SajuCell({han,ko,cls,lab}){
  return <div className={"cell "+(cls||'')}>{lab?<span className="lab">{lab}</span>:<><span className="han">{han}</span><span className="ko">{ko}</span></>}</div>;
}
function TabSaju(){
  return (
    <Phone tab="saju">
      <div className="ph-body" style={{paddingTop:12, paddingBottom:14, gap:12}}>
        <div className="row between vcenter">
          <span className="h2">사주원국</span>
          <span className="chip soft">만세력</span>
        </div>
        <div className="t-s muted">김시은 · 1997.06.24 (10:47) · 일간 丁火</div>

        {/* 만세력 표 */}
        <div className="saju">
          <div className="row">
            <SajuCell lab=""/><SajuCell lab="시주"/><SajuCell lab="일주"/><SajuCell lab="월주"/><SajuCell lab="년주"/>
          </div>
          <div className="row">
            <SajuCell lab="천간"/>
            <SajuCell han="乙" ko="을·木" cls="gan-wood"/>
            <SajuCell han="丁" ko="정·火(일간)" cls="gan-fire"/>
            <SajuCell han="丙" ko="병·火" cls="gan-fire"/>
            <SajuCell han="丁" ko="정·火" cls="gan-fire"/>
          </div>
          <div className="row">
            <SajuCell lab="지지"/>
            <SajuCell han="巳" ko="사·火" cls="gan-fire"/>
            <SajuCell han="酉" ko="유·金" cls="gan-metal"/>
            <SajuCell han="午" ko="오·火" cls="gan-fire"/>
            <SajuCell han="丑" ko="축·土" cls="gan-earth"/>
          </div>
          <div className="row">
            <SajuCell lab="십성"/>
            <div className="cell"><span className="ko" style={{fontSize:11}}>편인</span></div>
            <div className="cell"><span className="ko" style={{fontSize:11}}>본원</span></div>
            <div className="cell"><span className="ko" style={{fontSize:11}}>겁재</span></div>
            <div className="cell"><span className="ko" style={{fontSize:11}}>비견</span></div>
          </div>
        </div>

        {/* 오행 분포 */}
        <div className="sk sk-thin" style={{padding:'12px'}}>
          <div className="row between vcenter"><span className="t-s bold">오행 분포</span><span className="t-xs muted">火 과다 · 水 부재</span></div>
          <div className="bars" style={{marginTop:14}}>
            <Bars data={[{label:'木',pct:30},{label:'火',pct:90,fire:true},{label:'土',pct:34},{label:'金',pct:26},{label:'水',pct:10}]}/>
          </div>
        </div>

        {/* 신살·길성 */}
        <div className="col gap6">
          <span className="t-s bold">신살 · 길성</span>
          <div className="row gap6" style={{flexWrap:'wrap'}}>
            <span className="chip pink">도화살</span><span className="chip">반안살</span><span className="chip soft">백호대살</span><span className="chip soft">천을귀인</span>
          </div>
        </div>
        <Note>사주원국 · 이 탭만 정밀·신뢰 톤 (실제 표 구조)</Note>
      </div>
    </Phone>
  );
}

/* ---------- 3. 풀이 ---------- */
function TabRead(){
  return (
    <Phone tab="read">
      <div className="ph-body" style={{paddingTop:12, paddingBottom:14, gap:12}}>
        <span className="h2">나는 어떤 사람인가</span>
        <div className="sk sk-2" style={{padding:'14px'}}>
          <span className="chip fill" style={{alignSelf:'flex-start'}}>성향 리딩</span>
          <div className="t" style={{marginTop:10, lineHeight:1.5}}>
            <b>시은</b>님은 丁火의 기운이 중심에 있는 사람으로, 따뜻함과 섬세함이 함께 드러나는 편이에요.
          </div>
          <Lines rows={['w90','w90','w80','w90','w60']} style={{marginTop:12}}/>
        </div>

        {/* 대운·세운 미니 타임라인 */}
        <div className="col gap6">
          <span className="t-s bold">대운 · 세운 흐름</span>
          <div className="sk sk-thin" style={{padding:'12px 10px'}}>
            <div className="row between" style={{position:'relative'}}>
              {['14','24','34','44'].map((y,i)=>(
                <div key={y} className="col vcenter" style={{gap:5, alignItems:'center'}}>
                  <div className="sk-thin" style={{width:26, height:26, borderRadius:'50%', border:'1.6px solid '+(i===1?'var(--accent)':'var(--ph-line)'), background:i===1?'var(--accent-soft)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:i===1?'var(--accent)':'var(--ink-soft)'}}>{y}</div>
                  <span className="t-xs muted">{i===1?'현재':y+'세'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 주의 / 좋은 흐름 */}
        <div className="row gap8">
          <div className="sk sk-thin g1" style={{padding:'10px'}}>
            <span className="t-s bold">⚠ 주의 흐름</span>
            <Lines rows={['w90','w60']} style={{marginTop:8}}/>
          </div>
          <div className="sk sk-thin g1" style={{padding:'10px'}}>
            <span className="t-s bold">✓ 좋은 흐름</span>
            <Lines rows={['w80','w70']} style={{marginTop:8}}/>
          </div>
        </div>
        <Note>풀이 · 긴 텍스트 해석 + 대운/세운 흐름</Note>
      </div>
    </Phone>
  );
}

/* ---------- 4. 명당 — 상세화 (추천 1/2/3 + 부적합 사유 + 개운법) ---------- */
function PlaceCard({rank, dong, gu, han, tags, reason, match, ctas}){
  return (
    <div className="sk sk-thin" style={{padding:'12px', borderColor:match==='o'?'var(--accent)':'var(--ph-line)', borderWidth:match==='o'?'2px':'1.6px'}}>
      <div className="row between vcenter" style={{marginBottom:8}}>
        <span className="h3">{rank}. {dong}</span>
        {match==='o' && <span className="chip fill">추천</span>}
        {match==='x' && <span className="chip" style={{background:'#F0E4E4', borderColor:'#D9B5B5', color:'#8C4C4C'}}>부적합</span>}
      </div>
      <div className="t-xs muted">{gu} · {han}</div>
      <div className="row gap6" style={{margin:'8px 0', flexWrap:'wrap'}}>
        {tags.map((t,i)=>(
          <span key={i} className="chip soft">{t}</span>
        ))}
      </div>
      <div className="t-s" style={{marginBottom:10, lineHeight:1.4}}>{reason}</div>
      {ctas && (
        <div className="row gap6" style={{flexWrap:'wrap'}}>
          {ctas.map((c,i)=><span key={i} className="btn sm ghost" style={{fontSize:11, padding:'5px 8px'}}>{c}</span>)}
        </div>
      )}
    </div>
  );
}
function TabPlace(){
  return (
    <Phone tab="place">
      <div className="ph-body" style={{paddingTop:12, paddingBottom:14, gap:12}}>
        <span className="h2">명당</span>
        <div className="row gap6" style={{flexWrap:'wrap'}}>
          <span className="chip fill">내 후보</span><span className="chip soft">지형별</span><span className="chip soft">침대 방향</span><span className="chip soft">길방</span>
        </div>

        {/* 추천 TOP 3 */}
        <span className="t-s bold">火를 누그러뜨리고 水를 보충할 지역</span>
        <PlaceCard 
          rank="1" 
          dong="옥수동" 
          gu="서울 성동구" 
          han="玉水洞" 
          tags={['水 보완','수변형','아파트 많음']}
          reason="이름에 水가 있고 한강과 가까운 수변 지형. 한강공원 산책으로 水 에너지 보충하기 좋아요."
          match="o"
          ctas={['아파트 정보','인테리어 팁']}
        />
        <PlaceCard 
          rank="2" 
          dong="여의도" 
          gu="서울 영등포구" 
          han="汝矣島" 
          tags={['水 보완','섬형','공원 인접']}
          reason="물로 둘러싸인 섬. 여의샛강과 한강이 만나는 수변 지역으로 수기(水氣)가 매우 강해요. 산책과 조용함이 있는 곳."
          match="o"
          ctas={['오늘의집','쿠팡 추천']}/> 
        <PlaceCard 
          rank="3" 
          dong="탄천로" 
          gu="서울 강남구" 
          han="炭川路" 
          tags={['水 보완','하천변','자연 친화']}
          reason="탄천의 수변 보행로. 물소리가 있는 환경에서 水 기운을 꾸준히 받을 수 있는 주거지역."
          match="o"
          ctas={['평면도 보기','개운 소품']}
        />

        {/* 부적합 이유 */}
        <div className="col gap8">
          <span className="t-s bold">이 지역들은 왜 추천하지 않을까요</span>
          <PlaceCard 
            rank="—" 
            dong="강북구 수유" 
            gu="서울 강북구" 
            han="水踰" 
            tags={['산지형','높은곳','고지대']}
            reason="산이 높고 물이 드물어 火의 에너지가 너무 강해져요. 시원한 느낌을 원한다면 맞지 않습니다."
            match="x"
          />
          <PlaceCard 
            rank="—" 
            dong="도심 남산" 
            gu="서울 중구" 
            han="南山" 
            tags={['고지대','난방비 높음','건조함']}
            reason="높은 지대에 나무가 많아 木 기운이 과하고 火와 겹쳐요. 通風이 좋아 물기가 빠져나갑니다."
            match="x"
          />
        </div>

        {/* 침대 머리 방향 */}
        <div className="sk sk-2" style={{padding:'14px', background:'var(--accent-soft)', borderColor:'var(--accent)'}}>
          <div className="row between vcenter"><span className="t-s bold">침대 머리 방향</span><span className="chip">남쪽</span></div>
          <div className="row gap10 vcenter" style={{marginTop:10}}>
            <div className="sk-thin" style={{width:56, height:56, borderRadius:'50%', border:'2px solid var(--accent)', position:'relative', flex:'0 0 56px'}}>
              <span style={{position:'absolute', top:3, left:'50%', transform:'translateX(-50%)', fontSize:10, fontWeight:700}}>N</span>
              <span style={{position:'absolute', bottom:3, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'var(--accent)', fontWeight:700}}>S</span>
              <div style={{position:'absolute', top:'50%', left:'50%', width:2.5, height:20, background:'var(--accent)', transform:'translate(-50%,0) rotate(180deg)', transformOrigin:'top'}}></div>
            </div>
            <div className="col g1"><div className="t-s bold">남쪽 방향</div><div className="t-s">반안살 기준. 돌리기 어렵다면 남쪽 벽을 정돈하거나 따뜻한 조명, 화병을 두세요.</div></div>
          </div>
        </div>

        {/* 개운법 */}
        <div className="col gap6">
          <span className="t-s bold">지금 시작할 개운법</span>
          <div className="row gap6" style={{flexWrap:'wrap'}}>
            <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF'}}>🌊 물컵 매일 마시기</span>
            <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF'}}>🫧 욕실 습도 유지</span>
            <span className="chip" style={{background:'#E8F0FF', borderColor:'#A5C8FF'}}>💙 파란색 소품</span>
          </div>
          <div className="btn pri sm">쿠팡에서 추천 소품 보기</div>
        </div>
        <Note>명당 · 추천 1/2/3 + 부적합 사유 + 개운법 + 쇼핑 CTA</Note>
      </div>
    </Phone>
  );
}

/* ---------- 5. 마이 ---------- */
function TabMy(){
  return (
    <Phone tab="my">
      <div className="ph-body" style={{paddingTop:12, paddingBottom:14, gap:12}}>
        <span className="h2">마이</span>
        <div className="sk sk-2 row vcenter gap12" style={{padding:'14px'}}>
          <Mascot s={56} pink/>
          <div className="col g1"><span className="h3">시은</span><span className="t-s muted">丁火 · 붉은 닭 · 함께한 지 1일</span></div>
          <span className="t-xs accent">편집 ›</span>
        </div>

        {/* 저장한 카드 */}
        <div className="col gap6">
          <span className="t-s bold">저장한 공유 카드</span>
          <div className="row gap8">
            {['귀여운','사주덕후','명당'].map(x=>(
              <div key={x} className="imgph g1" style={{height:84, borderRadius:10}}>{x} 카드</div>
            ))}
          </div>
        </div>

        {/* 기록/체크인 */}
        <div className="sk sk-thin" style={{padding:'12px'}}>
          <div className="row between vcenter"><span className="t-s bold">미션 기록</span><span className="t-xs muted">이번 주</span></div>
          <div className="row gap6" style={{marginTop:10}}>
            {[1,1,1,0,1,0,0].map((v,i)=>(
              <div key={i} className="g1 center" style={{aspectRatio:'1', border:'1.6px solid '+(v?'var(--accent)':'var(--ph-line)'), background:v?'var(--accent-soft)':'transparent', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:v?'var(--accent)':'var(--ink-faint)'}}>{v?'✓':'·'}</div>
            ))}
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="col gap8">
          {['공유 이력','저장한 명당 후보','알림 설정','면책 고지 · 약관'].map(x=>(
            <div key={x} className="row between vcenter" style={{padding:'9px 2px', borderBottom:'1.4px dashed var(--ph-line)'}}>
              <span className="t">{x}</span><span className="t-xs muted">›</span>
            </div>
          ))}
        </div>
        <Note>마이 · 프로필 · 저장 카드 · 기록 · 설정</Note>
      </div>
    </Phone>
  );
}

Object.assign(window, { TabHome, TabSaju, TabRead, TabPlace, TabMy });
