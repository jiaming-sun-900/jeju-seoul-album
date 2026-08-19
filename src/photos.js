// 照片列表。process-images.mjs 会把 source-images/{jeju,seoul} 里的原图
// 处理成 public/images/{name}.webp (1200px) 和 {name}-2x.webp (2000px)。
// 在这里按你想要的顺序引用文件名即可，增删图片只需要改这个数组。
//
// 每一项：
//   { name: 'jeju-01', caption: '可选说明' }              单张大图
//   { pair: ['jeju-03', 'jeju-04'], caption: '可选说明' }  两张并排
//
// 尺寸默认自动交替（宽/窄/居中），如果某张想强制指定，
// 加一个 size 字段覆盖默认节奏：size: 'wide' | 'regular' | 'narrow'

export const jeju = [
  { name: 'jeju-01', caption: '' },
  { name: 'jeju-02', caption: '' },
  { name: 'jeju-03', caption: '' },
  { name: 'jeju-04', caption: '' },
  { name: 'jeju-05', caption: '' },
  { name: 'jeju-06', caption: '' },
  { name: 'jeju-07', caption: '' },
  { name: 'jeju-08', caption: '' },
];

export const seoul = [
  { name: 'seoul-01', caption: '' },
  { name: 'seoul-02', caption: '' },
  { name: 'seoul-03', caption: '' },
  { name: 'seoul-04', caption: '' },
  { name: 'seoul-05', caption: '' },
  { name: 'seoul-06', caption: '' },
  { name: 'seoul-07', caption: '' },
  { name: 'seoul-08', caption: '' },
];
