export default {
    input: "src/index.js",
    output: {
        file: "dist/index.js",
        format: "umd",
        name: "wechatRequest",
    },
    watch: {
        include: "src/**",
    },
};
