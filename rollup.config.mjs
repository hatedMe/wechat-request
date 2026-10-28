import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

export default [
    {
        // JS 产物入口只保留默认导出：require('wechat-request') 直接得到
        // 可调用的请求实例（与旧版 UMD 形态一致），命名能力以实例属性挂载。
        input: 'src/request.ts',
        output: {
            file: 'dist/index.js',
            format: 'umd',
            name: 'wechatRequest',
            exports: 'default',
        },
        plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
        watch: {
            include: 'src/**',
        },
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.mjs',
            format: 'es',
        },
        plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'index.d.ts',
            format: 'es',
        },
        plugins: [dts({ tsconfig: './tsconfig.build.json' })],
    },
];
