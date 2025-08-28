import{E as f,U as Le,T as N,l as S,c as le,H as y,t as v,M as T,a3 as de,R as H,w as F,F as ce,Z as P,aa as E,y as M,ab as We,ac as Y,K as L,ad as C,b as Q,B as U,s as X,u as Ie,G as $e,ae as W,af as He,n as he,q as fe,a5 as pe,a8 as me,ag as ge,o as Ye,p as Xe,a6 as je,a7 as qe,a9 as Ne,ah as Qe,ai as Ke,aj as Ze,ak as I,al as Je,am as et,D as xe,m as _e,a0 as K,an as k,e as x,ao as tt}from"./index-NpTGPnyt.js";import{S as G,c as A,a as rt,b as nt,B as be}from"./colorToUniform-DmtBy-2V.js";class ye{static init(e){Object.defineProperty(this,"resizeTo",{set(t){globalThis.removeEventListener("resize",this.queueResize),this._resizeTo=t,t&&(globalThis.addEventListener("resize",this.queueResize),this.resize())},get(){return this._resizeTo}}),this.queueResize=()=>{this._resizeTo&&(this._cancelResize(),this._resizeId=requestAnimationFrame(()=>this.resize()))},this._cancelResize=()=>{this._resizeId&&(cancelAnimationFrame(this._resizeId),this._resizeId=null)},this.resize=()=>{if(!this._resizeTo)return;this._cancelResize();let t,r;if(this._resizeTo===globalThis.window)t=globalThis.innerWidth,r=globalThis.innerHeight;else{const{clientWidth:n,clientHeight:s}=this._resizeTo;t=n,r=s}this.renderer.resize(t,r),this.render()},this._resizeId=null,this._resizeTo=null,this.resizeTo=e.resizeTo||null}static destroy(){globalThis.removeEventListener("resize",this.queueResize),this._cancelResize(),this._cancelResize=null,this.queueResize=null,this.resizeTo=null,this.resize=null}}ye.extension=f.Application;class Te{static init(e){e=Object.assign({autoStart:!0,sharedTicker:!1},e),Object.defineProperty(this,"ticker",{set(t){this._ticker&&this._ticker.remove(this.render,this),this._ticker=t,t&&t.add(this.render,this,Le.LOW)},get(){return this._ticker}}),this.stop=()=>{this._ticker.stop()},this.start=()=>{this._ticker.start()},this._ticker=null,this.ticker=e.sharedTicker?N.shared:new N,e.autoStart&&this.start()}static destroy(){if(this._ticker){const e=this._ticker;this.ticker=null,e.destroy()}}}Te.extension=f.Application;class ve{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}ve.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"filter"};function at(a,e){e.clear();const t=e.matrix;for(let r=0;r<a.length;r++){const n=a[r];n.globalDisplayStatus<7||(e.matrix=n.worldTransform,e.addBounds(n.bounds))}return e.matrix=t,e}const st=new de({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class it{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new ce,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0}}}class we{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new S({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new le({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,n=this._pushFilterData();n.skip=!1,n.filters=r,n.container=e.container,n.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,i=s.resolution,o=s.antialias;if(r.length===0){n.skip=!0;return}const u=n.bounds;if(this._calculateFilterArea(e,u),this._calculateFilterBounds(n,t.renderTarget.rootViewPort,o,i,1),n.skip)return;const l=this._getPreviousFilterData(),h=this._findFilterResolution(i);let d=0,c=0;l&&(d=l.bounds.minX,c=l.bounds.minY),this._calculateGlobalFrame(n,d,c,h,s.width,s.height),this._setupFilterTextures(n,u,t,l)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const n=e.source,s=n.resolution,i=n.antialias;if(t.length===0)return r.skip=!0,e;const o=r.bounds;if(o.addRect(e.frame),this._calculateFilterBounds(r,o.rectangle,i,s,0),r.skip)return e;const u=s;this._calculateGlobalFrame(r,0,0,u,n.width,n.height),r.outputRenderSurface=y.getOptimalTexture(o.width,o.height,r.resolution,r.antialias),r.backTexture=v.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const c=r.outputRenderSurface;return c.source.alphaMode="premultiplied-alpha",c}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&y.returnTexture(t.backTexture),y.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const n=e.colorTexture.source._resolution,s=y.getOptimalTexture(t.width,t.height,n,!1);let i=t.minX,o=t.minY;r&&(i-=r.minX,o-=r.minY),i=Math.floor(i*n),o=Math.floor(o*n);const u=Math.ceil(t.width*n),l=Math.ceil(t.height*n);return this.renderer.renderTarget.copyToTexture(e,s,{x:i,y:o},{width:u,height:l},{x:0,y:0}),s}applyFilter(e,t,r,n){const s=this.renderer,i=this._activeFilterData,u=i.outputRenderSurface===r,l=s.renderTarget.rootRenderTarget.colorTexture.source._resolution,h=this._findFilterResolution(l);let d=0,c=0;if(u){const p=this._findPreviousFilterOffset();d=p.x,c=p.y}this._updateFilterUniforms(t,r,i,d,c,h,u,n),this._setupBindGroupsAndRender(e,t,s)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,n=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(T.shared),i=t.renderGroup||t.parentRenderGroup;return i&&i.cacheToLocalTransform&&s.prepend(i.cacheToLocalTransform),s.invert(),n.prepend(s),n.scale(1/t.texture.frame.width,1/t.texture.frame.height),n.translate(t.anchor.x,t.anchor.y),n}destroy(){}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const n=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(n,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:st,shader:e,state:e._state,topology:"triangle-list"}),r.type===H.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,n){if(e.backTexture=v.EMPTY,e.blendRequired){r.renderTarget.finishRenderPass();const s=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(s,t,n==null?void 0:n.bounds)}e.inputTexture=y.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),r.renderTarget.bind(e.inputTexture,!0),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,n,s,i){const o=e.globalFrame;o.x=t*n,o.y=r*n,o.width=s*n,o.height=i*n}_updateFilterUniforms(e,t,r,n,s,i,o,u){const l=this._filterGlobalUniforms.uniforms,h=l.uOutputFrame,d=l.uInputSize,c=l.uInputPixel,p=l.uInputClamp,b=l.uGlobalFrame,_=l.uOutputTexture;o?(h[0]=r.bounds.minX-n,h[1]=r.bounds.minY-s):(h[0]=0,h[1]=0),h[2]=e.frame.width,h[3]=e.frame.height,d[0]=e.source.width,d[1]=e.source.height,d[2]=1/d[0],d[3]=1/d[1],c[0]=e.source.pixelWidth,c[1]=e.source.pixelHeight,c[2]=1/c[0],c[3]=1/c[1],p[0]=.5*c[2],p[1]=.5*c[3],p[2]=e.frame.width*d[2]-.5*c[2],p[3]=e.frame.height*d[3]-.5*c[3];const g=this.renderer.renderTarget.rootRenderTarget.colorTexture;b[0]=n*i,b[1]=s*i,b[2]=g.source.width*i,b[3]=g.source.height*i,t instanceof v&&(t.source.resource=null);const m=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind(t,!!u),t instanceof v?(_[0]=t.frame.width,_[1]=t.frame.height):(_[0]=m.width,_[1]=m.height),_[2]=m.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const n=this._filterStack[r];if(!n.skip){e=n.bounds.minX,t=n.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?at(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const n=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;n&&t.applyMatrix(n)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,n=e.bounds,s=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),s.length===1)s[0].apply(this,r,e.outputRenderSurface,t);else{let i=e.inputTexture;const o=y.getOptimalTexture(n.width,n.height,i.source._resolution,!1);let u=o,l=0;for(l=0;l<s.length-1;++l){s[l].apply(this,i,u,!0);const d=i;i=u,u=d}s[l].apply(this,i,e.outputRenderSurface,t),y.returnTexture(o)}}_calculateFilterBounds(e,t,r,n,s){var _;const i=this.renderer,o=e.bounds,u=e.filters;let l=1/0,h=0,d=!0,c=!1,p=!1,b=!0;for(let g=0;g<u.length;g++){const m=u[g];if(l=Math.min(l,m.resolution==="inherit"?n:m.resolution),h+=m.padding,m.antialias==="off"?d=!1:m.antialias==="inherit"&&d&&(d=r),m.clipToViewport||(b=!1),!!!(m.compatibleRenderers&i.type)){p=!1;break}if(m.blendRequired&&!(((_=i.backBuffer)==null?void 0:_.useBackBuffer)??!0)){F("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),p=!1;break}p=m.enabled||p,c||(c=m.blendRequired)}if(!p){e.skip=!0;return}if(b&&o.fitBounds(0,t.width/n,0,t.height/n),o.scale(l).ceil().scale(1/l).pad((h|0)*s),!o.isPositive){e.skip=!0;return}e.antialias=d,e.resolution=l,e.blendRequired=c}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new it),this._filterStackIndex++,e}}we.extension={type:[f.WebGLSystem,f.WebGPUSystem],name:"filter"};function ot(a){const e=a._stroke,t=a._fill,n=[`div { ${[`color: ${P.shared.setValue(t.color).toHex()}`,`font-size: ${a.fontSize}px`,`font-family: ${a.fontFamily}`,`font-weight: ${a.fontWeight}`,`font-style: ${a.fontStyle}`,`font-variant: ${a.fontVariant}`,`letter-spacing: ${a.letterSpacing}px`,`text-align: ${a.align}`,`padding: ${a.padding}px`,`white-space: ${a.whiteSpace==="pre"&&a.wordWrap?"pre-wrap":a.whiteSpace}`,...a.lineHeight?[`line-height: ${a.lineHeight}px`]:[],...a.wordWrap?[`word-wrap: ${a.breakWords?"break-all":"break-word"}`,`max-width: ${a.wordWrapWidth}px`]:[],...e?[Pe(e)]:[],...a.dropShadow?[Se(a.dropShadow)]:[],...a.cssOverrides].join(";")} }`];return ut(a.tagStyles,n),n.join(" ")}function Se(a){const e=P.shared.setValue(a.color).setAlpha(a.alpha).toHexa(),t=Math.round(Math.cos(a.angle)*a.distance),r=Math.round(Math.sin(a.angle)*a.distance),n=`${t}px ${r}px`;return a.blur>0?`text-shadow: ${n} ${a.blur}px ${e}`:`text-shadow: ${n} ${e}`}function Pe(a){return[`-webkit-text-stroke-width: ${a.width}px`,`-webkit-text-stroke-color: ${P.shared.setValue(a.color).toHex()}`,`text-stroke-width: ${a.width}px`,`text-stroke-color: ${P.shared.setValue(a.color).toHex()}`,"paint-order: stroke"].join(";")}const Z={fontSize:"font-size: {{VALUE}}px",fontFamily:"font-family: {{VALUE}}",fontWeight:"font-weight: {{VALUE}}",fontStyle:"font-style: {{VALUE}}",fontVariant:"font-variant: {{VALUE}}",letterSpacing:"letter-spacing: {{VALUE}}px",align:"text-align: {{VALUE}}",padding:"padding: {{VALUE}}px",whiteSpace:"white-space: {{VALUE}}",lineHeight:"line-height: {{VALUE}}px",wordWrapWidth:"max-width: {{VALUE}}px"},J={fill:a=>`color: ${P.shared.setValue(a).toHex()}`,breakWords:a=>`word-wrap: ${a?"break-all":"break-word"}`,stroke:Pe,dropShadow:Se};function ut(a,e){for(const t in a){const r=a[t],n=[];for(const s in r)J[s]?n.push(J[s](r[s])):Z[s]&&n.push(Z[s].replace("{{VALUE}}",r[s]));e.push(`${t} { ${n.join(";")} }`)}}class j extends E{constructor(e={}){super(e),this._cssOverrides=[],this.cssOverrides=e.cssOverrides??[],this.tagStyles=e.tagStyles??{}}set cssOverrides(e){this._cssOverrides=e instanceof Array?e:[e],this.update()}get cssOverrides(){return this._cssOverrides}update(){this._cssStyle=null,super.update()}clone(){return new j({align:this.align,breakWords:this.breakWords,dropShadow:this.dropShadow?{...this.dropShadow}:null,fill:this._fill,fontFamily:this.fontFamily,fontSize:this.fontSize,fontStyle:this.fontStyle,fontVariant:this.fontVariant,fontWeight:this.fontWeight,letterSpacing:this.letterSpacing,lineHeight:this.lineHeight,padding:this.padding,stroke:this._stroke,whiteSpace:this.whiteSpace,wordWrap:this.wordWrap,wordWrapWidth:this.wordWrapWidth,cssOverrides:this.cssOverrides,tagStyles:{...this.tagStyles}})}get cssStyle(){return this._cssStyle||(this._cssStyle=ot(this)),this._cssStyle}addOverride(...e){const t=e.filter(r=>!this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides.push(...t),this.update())}removeOverride(...e){const t=e.filter(r=>this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides=this.cssOverrides.filter(r=>!t.includes(r)),this.update())}set fill(e){typeof e!="string"&&typeof e!="number"&&F("[HTMLTextStyle] only color fill is not supported by HTMLText"),super.fill=e}set stroke(e){e&&typeof e!="string"&&typeof e!="number"&&F("[HTMLTextStyle] only color stroke is not supported by HTMLText"),super.stroke=e}}const ee="http://www.w3.org/2000/svg",te="http://www.w3.org/1999/xhtml";class Ce{constructor(){this.svgRoot=document.createElementNS(ee,"svg"),this.foreignObject=document.createElementNS(ee,"foreignObject"),this.domElement=document.createElementNS(te,"div"),this.styleElement=document.createElementNS(te,"style"),this.image=new Image;const{foreignObject:e,svgRoot:t,styleElement:r,domElement:n}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(n)}}let re;function lt(a,e,t,r){r||(r=re||(re=new Ce));const{domElement:n,styleElement:s,svgRoot:i}=r;n.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${a}</div>`,n.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(s.textContent=t),document.body.appendChild(i);const o=n.getBoundingClientRect();i.remove();const u=e.padding*2;return{width:o.width-u,height:o.height-u}}class dt{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{M.return(e)}),this.batches.length=0}}class Ue{constructor(e,t){this.state=G.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,n=this.renderer.graphicsContext.updateGpuContext(t);return!!(n.isBatchable||r!==n.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let n=0;n<r.length;n++){const s=r[n];s._batcher.updateElement(s)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const s=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const i=s.resources.localUniforms.uniforms;i.uTransformMatrix=e.groupTransform,i.uRound=t._roundPixels|e._roundPixels,A(e.groupColorAlpha,i.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,n=this._getGpuDataForRenderable(e).batches;for(let s=0;s<n.length;s++){const i=n[s];r.addToBatch(i,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new dt;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,n=this.renderer.graphicsContext.getGpuContext(r),s=this.renderer._roundPixels|e._roundPixels;t.batches=n.batches.map(i=>{const o=M.get(We);return i.copyTo(o),o.renderable=e,o.roundPixels=s,o})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Ue.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"graphics"};class q{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let n=r;const s=this.texture.textureMatrix;return s.isSimple||(n=this._transformedUvs,(this._textureMatrixUpdateId!==s._updateID||this._uvUpdateId!==t._updateID)&&((!n||n.length<r.length)&&(n=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=s._updateID,this._uvUpdateId=t._updateID,s.multiplyUvs(r,n))),n}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class ne{destroy(){}}class Re{constructor(e,t){this.localUniforms=new S({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new le({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,n=e.batched;if(t.batched=n,r!==n)return!0;if(n){const s=e._geometry;if(s.indices.length!==t.indexSize||s.positions.length!==t.vertexSize)return t.indexSize=s.indices.length,t.vertexSize=s.positions.length,!0;const i=this._getBatchableMesh(e);return i.texture.uid!==e._texture.uid&&(i._textureMatrixUpdateId=-1),!i._batcher.checkAndUpdateTexture(i,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,{batched:n}=this._getMeshData(e);if(n){const s=this._getBatchableMesh(e);s.setTexture(e._texture),s.geometry=e._geometry,r.addToBatch(s,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=Y(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),A(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ne),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){var t,r;return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:(t=e._geometry.indices)==null?void 0:t.length,vertexSize:(r=e._geometry.positions)==null?void 0:r.length},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ne),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new q;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}Re.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"mesh"};class ct{execute(e,t){const r=e.state,n=e.renderer,s=t.shader||e.defaultShader;s.resources.uTexture=t.texture._source,s.resources.uniforms=e.localUniforms;const i=n.gl,o=e.getBuffers(t);n.shader.bind(s),n.state.set(r),n.geometry.bind(o.geometry,s.glProgram);const l=o.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?i.UNSIGNED_SHORT:i.UNSIGNED_INT;i.drawElements(i.TRIANGLES,t.particleChildren.length*6,l,0)}}class ht{execute(e,t){const r=e.renderer,n=t.shader||e.defaultShader;n.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),n.groups[1]=r.texture.getTextureBindGroup(t.texture);const s=e.state,i=e.getBuffers(t);r.encoder.draw({geometry:i.geometry,shader:t.shader||e.defaultShader,state:s,size:t.particleChildren.length*6})}}function ae(a,e=null){const t=a*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,n=0;r<t;r+=6,n+=4)e[r+0]=n+0,e[r+1]=n+1,e[r+2]=n+2,e[r+3]=n+0,e[r+4]=n+2,e[r+5]=n+3;return e}function ft(a){return{dynamicUpdate:se(a,!0),staticUpdate:se(a,!1)}}function se(a,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const s in a){const i=a[s];if(e!==i.dynamic)continue;t.push(`offset = index + ${r}`),t.push(i.code);const o=L(i.format);r+=o.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const n=t.join(`
`);return new Function("ps","f32v","u32v",n)}class pt{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let n=0,s=0;for(const h in r){const d=r[h],c=L(d.format);d.dynamic?s+=c.stride:n+=c.stride}this._dynamicStride=s/4,this._staticStride=n/4,this.staticAttributeBuffer=new C(t*4*n),this.dynamicAttributeBuffer=new C(t*4*s),this.indexBuffer=ae(t);const i=new de;let o=0,u=0;this._staticBuffer=new Q({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:U.VERTEX|U.COPY_DST}),this._dynamicBuffer=new Q({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:U.VERTEX|U.COPY_DST});for(const h in r){const d=r[h],c=L(d.format);d.dynamic?(i.addAttribute(d.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:o*4,format:d.format}),o+=c.size):(i.addAttribute(d.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:d.format}),u+=c.size)}i.addIndex(this.indexBuffer);const l=this.getParticleUpdate(r);this._dynamicUpload=l.dynamicUpdate,this._staticUpload=l.staticUpdate,this.geometry=i}getParticleUpdate(e){const t=mt(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return ft(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new C(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new C(this._size*this._dynamicStride*4*4),this.indexBuffer=ae(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const n=this.staticAttributeBuffer;this._staticUpload(e,n.float32View,n.uint32View),this._staticBuffer.setDataWithSize(n.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function mt(a){const e=[];for(const t in a){const r=a[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var gt=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,xt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,ie=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class _t extends X{constructor(){const e=Ie.from({vertex:xt,fragment:gt}),t=$e.from({fragment:{source:ie,entryPoint:"mainFragment"},vertex:{source:ie,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:v.WHITE.source,uSampler:new W({}),uniforms:{uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new P(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class Be{constructor(e,t){this.state=G.for2d(),this.localUniforms=new S({uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new _t,this.state=G.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new pt({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,n=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const s=this.state;n.update(t,e._childrenDirty),e._childrenDirty=!1,s.blendMode=Y(e.blendMode,e.texture._source);const i=this.localUniforms.uniforms,o=i.uTranslationMatrix;e.worldTransform.copyTo(o),o.prepend(r.globalUniforms.globalUniformData.projectionMatrix),i.uResolution=r.globalUniforms.globalUniformData.resolution,i.uRound=r._roundPixels|e._roundPixels,A(e.groupColorAlpha,i.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class Fe extends Be{constructor(e){super(e,new ct)}}Fe.extension={type:[f.WebGLPipes],name:"particle"};class Me extends Be{constructor(e){super(e,new ht)}}Me.extension={type:[f.WebGPUPipes],name:"particle"};class bt extends q{constructor(){super(),this.geometry=new He}destroy(){this.geometry.destroy()}}class Ge{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new bt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}Ge.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"nineSliceSprite"};const yt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},Tt={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let D,z;class vt extends X{constructor(){D??(D=he({name:"tiling-sprite-shader",bits:[rt,yt,fe]})),z??(z=pe({name:"tiling-sprite-shader",bits:[nt,Tt,me]}));const e=new S({uMapCoord:{value:new T,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new T,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:z,gpuProgram:D,resources:{localUniforms:new S({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:v.EMPTY.source,uSampler:v.EMPTY.source.style}})}updateUniforms(e,t,r,n,s,i){const o=this.resources.tilingUniforms,u=i.width,l=i.height,h=i.textureMatrix,d=o.uniforms.uTextureTransform;d.set(r.a*u/e,r.b*u/t,r.c*l/e,r.d*l/t,r.tx/e,r.ty/t),d.invert(),o.uniforms.uMapCoord=h.mapCoord,o.uniforms.uClampFrame=h.uClampFrame,o.uniforms.uClampOffset=h.uClampOffset,o.uniforms.uTextureTransform=d,o.uniforms.uSizeAnchor[0]=e,o.uniforms.uSizeAnchor[1]=t,o.uniforms.uSizeAnchor[2]=n,o.uniforms.uSizeAnchor[3]=s,i&&(this.resources.uTexture=i.source,this.resources.uSampler=i.source.style)}}class wt extends ge{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function St(a,e){const t=a.anchor.x,r=a.anchor.y;e[0]=-t*a.width,e[1]=-r*a.height,e[2]=(1-t)*a.width,e[3]=-r*a.height,e[4]=(1-t)*a.width,e[5]=(1-r)*a.height,e[6]=-t*a.width,e[7]=(1-r)*a.height}function Pt(a,e,t,r){let n=0;const s=a.length/e,i=r.a,o=r.b,u=r.c,l=r.d,h=r.tx,d=r.ty;for(t*=e;n<s;){const c=a[t],p=a[t+1];a[t]=i*c+u*p+h,a[t+1]=o*c+l*p+d,t+=e,n++}}function Ct(a,e){const t=a.texture,r=t.frame.width,n=t.frame.height;let s=0,i=0;a.applyAnchorToTexture&&(s=a.anchor.x,i=a.anchor.y),e[0]=e[6]=-s,e[2]=e[4]=1-s,e[1]=e[3]=-i,e[5]=e[7]=1-i;const o=T.shared;o.copyFrom(a._tileTransform.matrix),o.tx/=a.width,o.ty/=a.height,o.invert(),o.scale(a.width/r,a.height/n),Pt(e,2,0,o)}const B=new wt;class Ut{constructor(){this.canBatch=!0,this.geometry=new ge({indices:B.indices.slice(),positions:B.positions.slice(),uvs:B.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class Ae{constructor(e){this._state=G.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const n=t.canBatch;if(n&&n===r){const{batchableMesh:s}=t;return!s._batcher.checkAndUpdateTexture(s,e.texture)}return r!==n}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const n=this._getTilingSpriteData(e),{geometry:s,canBatch:i}=n;if(i){n.batchableMesh||(n.batchableMesh=new q);const o=n.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),o.geometry=s,o.renderable=e,o.transform=e.groupTransform,o.setTexture(e._texture)),o.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(o,t)}else r.break(t),n.shader||(n.shader=new vt),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,A(e.groupColorAlpha,r.uColor,0),this._state.blendMode=Y(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:B,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:n}=t;e.didViewUpdate&&this._updateBatchableMesh(e),n._batcher.updateElement(n)}else if(e.didViewUpdate){const{shader:n}=t;n.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new Ut;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,n=e.texture.source.style;n.addressMode!=="repeat"&&(n.addressMode="repeat",n.update()),Ct(e,r.uvs),St(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let n=!0;return this._renderer.type===H.WEBGL&&(n=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(n||r.source.isPowerOfTwo),t.canBatch}}Ae.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"tilingSprite"};const Rt={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},Bt={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},Ft={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Mt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let V,O;class Gt extends X{constructor(e){const t=new S({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});V??(V=he({name:"sdf-shader",bits:[Ye,Xe(e),Rt,Ft,fe]})),O??(O=pe({name:"sdf-shader",bits:[je,qe(e),Bt,Mt,me]})),super({glProgram:O,gpuProgram:V,resources:{localUniforms:t,batchSamplers:Ne(e)}})}}class At extends Je{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class ke{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,t)),this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);oe(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);oe(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,n=Qe.getFont(e.text,e._style);r.clear(),n.distanceField.type!=="none"&&(r.customShader||(r.customShader=new Gt(this._renderer.limits.maxBatchableTextures)));const s=Ke.graphemeSegmenter(e.text),i=e._style;let o=n.baseLineOffset;const u=Ze(s,i,n,!0),l=i.padding,h=u.scale;let d=u.width,c=u.height+u.offsetY;i._stroke&&(d+=i._stroke.width/h,c+=i._stroke.width/h),r.translate(-e._anchor._x*d-l,-e._anchor._y*c-l).scale(h,h);const p=n.applyFillAsTint?i._fill.color:16777215;for(let b=0;b<u.lines.length;b++){const _=u.lines[b];for(let g=0;g<_.charPositions.length;g++){const m=_.chars[g],w=n.chars[m];w!=null&&w.texture&&r.texture(w.texture,p||"black",Math.round(_.charPositions[g]+w.xOffset),Math.round(o+w.yOffset))}o+=n.lineHeight}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new At;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,n=I.get(`${r}-bitmap`),{a:s,b:i,c:o,d:u}=e.groupTransform,l=Math.sqrt(s*s+i*i),h=Math.sqrt(o*o+u*u),d=(Math.abs(l)+Math.abs(h))/2,c=n.baseRenderedFontSize/e._style.fontSize,p=d*n.distanceField.range*(1/c);t.customShader.resources.localUniforms.uniforms.uDistance=p}destroy(){this._renderer=null}}ke.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"bitmapText"};function oe(a,e){e.groupTransform=a.groupTransform,e.groupColorAlpha=a.groupColorAlpha,e.groupColor=a.groupColor,e.groupBlendMode=a.groupBlendMode,e.globalDisplayStatus=a.globalDisplayStatus,e.groupTransform=a.groupTransform,e.localDisplayStatus=a.localDisplayStatus,e.groupAlpha=a.groupAlpha,e._roundPixels=a._roundPixels}class kt extends be{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function $(a,e){const{texture:t,bounds:r}=a,n=e._style._getFinalPadding();et(r,e._anchor,t);const s=e._anchor._x*n*2,i=e._anchor._y*n*2;r.minX-=n-s,r.minY-=n-i,r.maxX-=n-s,r.maxY-=n-i}class De{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(n=>{console.error(n)}),e._didTextUpdate=!1,$(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const n=e.renderGroup||e.parentRenderGroup;n&&(n.structureDidChange=!0),t.generatingTexture=!1,$(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new kt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=v.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}De.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"htmlText"};function Dt(){const{userAgent:a}=xe.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(a)}const zt=new ce;function ze(a,e,t,r){const n=zt;n.minX=0,n.minY=0,n.maxX=a.width/r|0,n.maxY=a.height/r|0;const s=y.getOptimalTexture(n.width,n.height,r,!1);return s.source.uploadMethodId="image",s.source.resource=a,s.source.alphaMode="premultiply-alpha-on-upload",s.frame.width=e/r,s.frame.height=t/r,s.source.emit("update",s.source),s.updateUvs(),s}function Vt(a,e){const t=e.fontFamily,r=[],n={},s=/font-family:([^;"\s]+)/g,i=a.match(s);function o(u){n[u]||(r.push(u),n[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)o(t[u]);else o(t);i&&i.forEach(u=>{const l=u.split(":")[1].trim();o(l)});for(const u in e.tagStyles){const l=e.tagStyles[u].fontFamily;o(l)}return r}async function Ot(a){const t=await(await xe.get().fetch(a)).blob(),r=new FileReader;return await new Promise((s,i)=>{r.onloadend=()=>s(r.result),r.onerror=i,r.readAsDataURL(t)})}async function ue(a,e){const t=await Ot(e);return`@font-face {
        font-family: "${a.fontFamily}";
        src: url('${t}');
        font-weight: ${a.fontWeight};
        font-style: ${a.fontStyle};
    }`}const R=new Map;async function Et(a,e,t){const r=a.filter(n=>I.has(`${n}-and-url`)).map((n,s)=>{if(!R.has(n)){const{url:i}=I.get(`${n}-and-url`);s===0?R.set(n,ue({fontWeight:e.fontWeight,fontStyle:e.fontStyle,fontFamily:n},i)):R.set(n,ue({fontWeight:t.fontWeight,fontStyle:t.fontStyle,fontFamily:n},i))}return R.get(n)});return(await Promise.all(r)).join(`
`)}function Lt(a,e,t,r,n){const{domElement:s,styleElement:i,svgRoot:o}=n;s.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${a}</div>`,s.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),i.textContent=r;const{width:u,height:l}=n.image;return o.setAttribute("width",u.toString()),o.setAttribute("height",l.toString()),new XMLSerializer().serializeToString(o)}function Wt(a,e){const t=_e.getOptimalCanvasAndContext(a.width,a.height,e),{context:r}=t;return r.clearRect(0,0,a.width,a.height),r.drawImage(a,0,0),t}function It(a,e,t){return new Promise(async r=>{t&&await new Promise(n=>setTimeout(n,100)),a.onload=()=>{r()},a.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,a.crossOrigin="anonymous"})}class Ve{constructor(e){this._renderer=e,this._createCanvas=e.type===H.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:n,textureStyle:s}=e,i=M.get(Ce),o=Vt(t,r),u=await Et(o,r,j.defaultTextStyle),l=lt(t,r,u,i),h=Math.ceil(Math.ceil(Math.max(1,l.width)+r.padding*2)*n),d=Math.ceil(Math.ceil(Math.max(1,l.height)+r.padding*2)*n),c=i.image,p=2;c.width=(h|0)+p,c.height=(d|0)+p;const b=Lt(t,r,n,u,i);await It(c,b,Dt()&&o.length>0);const _=c;let g;this._createCanvas&&(g=Wt(c,n));const m=ze(g?g.canvas:_,c.width-p,c.height-p,n);return s&&(m.source.style=s),this._createCanvas&&(this._renderer.texture.initSource(m.source),_e.returnCanvasAndContext(g)),M.return(i),m}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{F("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){y.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}Ve.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"htmlText"};class $t extends be{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class Oe{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=t.texture=this._renderer.canvasText.getTexture(e),$(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new $t(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Oe.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"text"};class Ee{constructor(e){this._renderer=e}getTexture(e,t,r,n){typeof e=="string"&&(K("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof E||(e.style=new E(e.style)),e.textureStyle instanceof W||(e.textureStyle=new W(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:s,style:i,textureStyle:o}=e,u=e.resolution??this._renderer.resolution,{frame:l,canvasAndContext:h}=k.getCanvasAndContext({text:s,style:i,resolution:u}),d=ze(h.canvas,l.width,l.height,u);if(o&&(d.source.style=o),i.trim&&(l.pad(i.padding),d.frame.copyFrom(l),d.updateUvs()),i.filters){const c=this._applyFilters(d,i.filters);return this.returnTexture(d),k.returnCanvasAndContext(h),c}return this._renderer.texture.initSource(d._source),k.returnCanvasAndContext(h),d}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",y.returnTexture(e,!0)}renderTextToCanvas(){K("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,n=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),n}destroy(){this._renderer=null}}Ee.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"canvasText"};x.add(ye);x.add(Te);x.add(Ue);x.add(tt);x.add(Re);x.add(Fe);x.add(Me);x.add(Ee);x.add(Oe);x.add(ke);x.add(Ve);x.add(De);x.add(Ae);x.add(Ge);x.add(we);x.add(ve);
