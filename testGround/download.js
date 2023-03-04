import axios from "axios";
//这是一个QQ机器人
//这个是请求并下载一个B站的视频的程序
//evnet是消息
//第一行是检测消息的，必须有，不用管它
//envent.reply()是发送QQ消息
//下载的代码原地址在这里：https://github.com/axios/axios/issues/2899

console.log("Start");
var furl =
  "https://xy183x131x68x19xy.mcdn.bilivideo.cn:4483/upgcxcode/93/40/1001724093/1001724093-1-208.mp4?e=ig8euxZM2rNcNbNzhzdVhwdlhbhzhwdVhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=\u0026uipk=5\u0026nbs=1\u0026deadline=1677833187\u0026gen=playurlv2\u0026os=mcdn\u0026oi=1927047873\u0026trid=00006ad00c5d47064740ba3850aba5738bcfu\u0026mid=153533638\u0026platform=pc\u0026upsig=2c807ce0b4c9a7246caeb9f76736f099\u0026uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform\u0026mcdnid=1002683\u0026bvc=vod\u0026nettype=0\u0026orderid=0,3\u0026buvid=1C07B3DD-2968-1D87-B338-B79B06C5B6A155243infoc\u0026build=0\u0026agrr=1\u0026bw=233636\u0026logo=A0000001";
const downloadFile = async () => {
  const { data, headers } = await axios({
    url: furl,
    method: "GET",
    responseType: "stream",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      Referer: "https://www.bilibili.com/video/BV1t84y1V7zw/",
      cookie: `buvid3=1C07B3DD-2968-1D87-B338-B79B06C5B6A155243infoc; b_nut=1670031055; _uuid=333D34A2-3B29-B956-10FBF-21032332D554755483infoc; i-wanna-go-back=-1; buvid_fp_plain=undefined; rpdid=|(umk~|kYJkY0J'uY~||JJ)lm; buvid4=C1F51942-A175-11B2-8B0B-A6072C212F8956444-022120309-hTK/EJd6Oy2A2MeQ2Vlbag==; nostalgia_conf=-1; is-2022-channel=1; hit-new-style-dyn=0; hit-dyn-v2=1; dy_spec_agreed=1; LIVE_BUVID=AUTO7016717744547121; CURRENT_BLACKGAP=0; header_theme_version=CLOSE; bp_video_offset_519449247=765475575970136000; DedeUserID=153533638; DedeUserID__ckMd5=0e45b2ba51dfc8a9; b_ut=5; bsource=search_bing; SESSDATA=bb1d1ea1,1693228479,888bb*31; bili_jct=878be0297c14a88cdb5a764dfb871ee0; sid=7fxyqebr; CURRENT_PID=a1efc850-b83f-11ed-86d4-b39238e6b9e7; CURRENT_FNVAL=4048; bp_video_offset_153533638=768459882453008400; CURRENT_QUALITY=32; PVID=4; home_feed_column=5; fingerprint=5becc1bee59e16df89cb0a703df94b5f; b_lsid=7FA83572_186A407427D; innersign=0; buvid_fp=a5496bd92500fcdeb564c79d0b68c384`,
    },
  });

  const contentLength = headers["content-length"];

  console.log(contentLength);

  data.on("data", (chunk) => {
    // console.log(chunk)
  });
  data.pipe(fs.createWriteStream("dist/1.mp4"));
};
const pro2 = async () => {
  // await f1();
  await downloadFile();
  console.log("pro2=pro2");
};
const pro3 = async () => {
  await pro2();
  event.reply([segment.video("dist/1.mp4")]);
  console.log("pro3");
};
pro3();
