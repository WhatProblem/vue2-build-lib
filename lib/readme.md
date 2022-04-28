### vir-list-v2

#### 插件的安装

```bash
npm i vir-list-v2
```

#### 引入插件

```bash
import virListV2Plugin from 'vir-list-v2';

Vue.use(vir-list-v2)
```

#### 基本用法

```vue
<vir-list-v2 vmodel="demo" :options="options" labelName="名称" />

export default {
    data() {
        demo: 1,
        options: [
            { label: 'xxxx', value: 1 },
            { label: 'yyyy', value: 2 }
        ]
    }
}
```

#### API

| 参数 | 说明 | 类型 | 默认值 |
| --- | :--- | :--- | :---: |
| v-model | 双向绑定变量 | 基本类型 | - |
| options | 接口返回的下拉数据列表 | 对象数组 Array<Object> | [] |
| labelName | label 绑定的文案名称 | String | '' |
| labelWidth | 文案宽度(px) | String | '72' |
| labelPositon | 文案位置(text-align) | String | 'right' |
| placeholder | placeholder | String | '请选择内容' |
| headerHeight | 选择框高度(px) | String | '30' |
| lineHeight | line-height | String | '30' |
| showNum | 下拉框显示的条数 | Number | 10 |



<table border="1" cellpadding="0" cellspacing="0">
<tr>
  <th>参数</th>
  <th>说明</th>
  <th>类型</th>
  <th>默认值</th>
</tr>
<tr>
  <td>v-model</td>
  <td>双向绑定变量</td>
  <td>基本类型</td>
  <td>-</td>
</tr>
<tr>
  <td>options</td>
  <td>接口返回的下拉数据列表</td>
  <td>对象数组 Array</td>
  <td>[]</td>
</tr>
<tr>
  <td>labelName</td>
  <td>label 绑定的文案名称</td>
  <td>String</td>
  <td>''</td>
</tr>
<tr>
  <td>labelWidth</td>
  <td>文案宽度(px)</td>
  <td>String</td>
  <td>'72'</td>
</tr>
<tr>
  <td>labelPositon</td>
  <td>文案位置(text-align)</td>
  <td>String</td>
  <td>'right'</td>
</tr>
<tr>
  <td>placeholder</td>
  <td>placeholder</td>
  <td>String</td>
  <td>'请选择内容'</td>
</tr>
<tr>
  <td>headerHeight</td>
  <td>选择框高度(px)</td>
  <td>String</td>
  <td>'30'</td>
</tr>
<tr>
  <td>lineHeight</td>
  <td>line-height</td>
  <td>String</td>
  <td>'30'</td>
</tr>
<tr>
  <td>showNum</td>
  <td>下拉框显示的条数</td>
  <td>Number</td>
  <td>10</td>
</tr>
</table>