<template>
  <div class="home">
      <h1 class="header">音乐搜索</h1>
      <hr> 
      <div class="count">
         <el-input  placeholder="请输入歌手或者歌曲名" v-model="input"  clearable  class="input"></el-input>
         <el-button type="primary" icon="el-icon-search" @click="soso"   :disabled="!this.input">搜索</el-button>
      </div>
      <div class="infinite-list-wrapper">
          <el-table :data="tableData" class="table"  border size='small'    v-infinite-scroll="load"  infinite-scroll-distance="10" infinite-scroll-disabled="disabled"  :row-class-name="tableRowClassName" style="overflow:auto">  
                <el-table-column   width="50"   label="序号" resizable   align="center"  >
                      <template slot-scope="scope">{{(scope.$index+1)}} </template>
                </el-table-column>
                <el-table-column prop="songname" label="音乐名称" resizable    show-overflow-tooltip></el-table-column>
                <el-table-column prop="singer[0].name" label="作者" resizable></el-table-column>
                <el-table-column prop="albumname" label="专辑" resizable></el-table-column>
                <el-table-column prop="interval" label="音乐时长" resizable   :formatter="interval"></el-table-column> 
                <el-table-column  label="播放"   align="center"  width="100px" > 
                    <template slot-scope="scope"  style="width:100%;text-align:center">
                        <el-button type="primary"    icon="el-icon-video-play" @click="play(scope.$index)"  size="small">播放</el-button>
                    </template>
                </el-table-column > 
                 <el-table-column width="20px">  </el-table-column> 
           </el-table>
           <p v-if="loading" style="height:20px">正在加载中...</p>
           <p v-if="noMore" style="height:20px">没有更多了</p>
     </div>
    <!-- <br><br><br><br> -->
      <div class="play"  :class="shows==true?'plays':''">
             <aplayer :audio="audio" 
               ref="aplayer"
               preload="metadata" 
               autoplay  
              :lrcType="1" 
               fixed  
               @lrcShow="shows=true"
               @lrcHide="shows=false"/>
      </div>

  </div>
</template>

<script>
export default {
  name: 'home',
  components:{
  },

  data() {
      return {
        loading: false,
        audio: [],
        shows:false,
        input: '',
        page:1,
        curnum:0,
        n:20,
        tableData:[],
      }
    },

     mounted() {
     this.noMore=false
    },
     computed: {
      noMore () {
        return this.curnum < this.n 
      },
      disabled () {
        return this.loading || this.noMore
      }
    },

    methods:{
      tableRowClassName({row,rowIndex}) {
        if(row.isonly==1 ||row.size128==0){
          console.log(rowIndex+1+"不能播放");
          // return 'warning-row';
        }
        
      },


      interval(row, column, cellValue){
         if(cellValue){
           return  Math.floor(cellValue/60).toString().padStart(2,"0")+":"+(cellValue-(Math.floor(cellValue/60))*60).toString().padStart(2,"0");   
         }else{
           return '暂无时长'
         }
      },
 

      pubtime(row, column, cellValue,index){
        if(cellValue){
           return new Date(cellValue*1000).toLocaleDateString();
         }else{
           return '暂无发行时间'
         }
      },

      

      play(i){
        this.$axios.get('http://www.mhweb.top:3000/musicu',{
           params:{
           "songmid":this.tableData[i].songmid,
           }
        }).then( (res) =>{
        this.lyric(i)
        this.tableData[i].musicUrl=res.data.req_0.data.sip[0]+res.data.req_0.data.midurlinfo[0].purl; 
        this.tableData[i].imgUrl="http://y.gtimg.cn/music/photo_new/T002R180x180M000" + this.tableData[i].albummid + ".jpg";
        if(this.tableData[i].musicUrl=='http://ws.stream.qqmusic.qq.com/'){
           this.$message({
          showClose: true,
          message: 'Sorry ,此歌曲无版权,暂不支持播放!!!!',
          type: 'error',
           center: true,
           offset:5
        });
          return ;
        }else{
            setTimeout( ()=>{
        this.audio.push({
            // id:this.tableData[i].cdIdx,
            name: this.tableData[i].songname,
            artist: this.tableData[i].singer[0].name,
            url:this.tableData[i].musicUrl,
            cover: this.tableData[i].imgUrl,
            lrc: this.tableData[i].lyric,
        });
        },400)
        }
        }).catch ((err) => {
         console.log('失败',err);
         alert("获取资源失败,请联系管理员!!")
        })
      },


      lyric(i){
          this.$axios.get('http://www.mhweb.top:3000/lyric',{
           params:{
            "songmid":this.tableData[i].songmid,
             "time":new Date().getTime(),
           }
        }).then( (res) =>{
            this.tableData[i].lyric=res.data.lyric;
        }).catch ((err) => {
         console.log('失败',err)
        })
      },

      soso(){
          this.page=1;
          this.tableData=[];
          this.totalnum=0;
          this.go();
      },

       go(){  
        this.$axios.get('http://www.mhweb.top:3000/proxy',{
          params:{
          'p':this.page,
          'n':this.n,
          'w':this.input,
          }
        }).then( (res) =>{
          this.curnum=res.data.data.song.curnum;
          for(let i=0;i<this.curnum;i++){
                this.tableData.push(res.data.data.song.list[i])
             } 
          this.loading = false
        }).catch ((err) => {
         console.log('失败',err)
        })
      },


       load (){
       this.loading = true
       this.page+=1;
      setTimeout(() =>{
      this.go();
       },100)
      },


  }
}
</script>

<style>
.home{
  width: 100%;
  height: 100%;
  overflow-y: hidden
}
.header{
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.table{
  width: 100%;
  height: 510px;
}
.infinite-list-wrapper{
 text-align: center;
 margin-bottom: 4%;
}
.el-table .warning-row {
       background: rgba(92, 89, 89, 0.616);
  }

.play{
    position: fixed;
    /* display: block; */
    right: 0;
    left: 0;
    bottom: 0;
    height: 66px;
    z-index: 999;
    /* position: relative; */
    background: rgb(22, 21, 21);
    
}
.plays{
 background: rgba(22, 21, 21, 0.9);
}

@media screen and (max-width: 1920px) {
.count{
  display: flex;
  justify-content: center;
  width:80%;
  margin: 2% auto;
}
.count .input{
 width:100%;
 min-width: 200px;
 margin-right: 2%;
}
}

</style>

