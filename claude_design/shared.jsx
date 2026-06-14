/* 공용 와이어프레임 빌딩블록 */

function Status({label}){
  return (
    <div className="sbar">
      <span>9:41</span>
      <span className="dots">●●● ⌃ ▭</span>
    </div>
  );
}

function TabBar({active}){
  const tabs=[['홈','home'],['사주원국','saju'],['풀이','read'],['명당','place'],['마이','my']];
  return (
    <div className="tabbar">
      {tabs.map(([t,k])=>(
        <div key={k} className={"tab"+(active===k?' on':'')}>
          <div className="ic"></div><span>{t}</span>
        </div>
      ))}
    </div>
  );
}

function Phone({children, tab, noStatus}){
  return (
    <div className="ph">
      {!noStatus && <Status/>}
      <div className="ph-screen">{children}</div>
      {tab && <TabBar active={tab}/>}
    </div>
  );
}

function Mascot({s=74, pink, cls=''}){
  return (
    <div className={"mascot "+(pink?'pink ':'')+cls} style={{['--s']:s+'px'}}>
      <div className="ear l"></div><div className="ear r"></div>
      <div className="face"></div>
      <div className="eye l"></div><div className="eye r"></div>
      <div className="mo"></div>
    </div>
  );
}

function ImgPH({label, h=90, style}){
  return <div className="imgph" style={{height:h, ...style}}>{label}</div>;
}

function Lines({rows=['w90','w70'], style}){
  return <div className="lines" style={style}>{rows.map((w,i)=><div key={i} className={"ln "+w}></div>)}</div>;
}

function Note({children}){ return <div className="note">{children}</div>; }

function Bars({data}){
  // data: [{label, pct, fire}]
  return (
    <div className="bars">
      {data.map((d,i)=>(
        <div key={i} className={"bar"+(d.fire?' fire':'')} style={{height:d.pct+'%'}}>
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Status, TabBar, Phone, Mascot, ImgPH, Lines, Note, Bars });
