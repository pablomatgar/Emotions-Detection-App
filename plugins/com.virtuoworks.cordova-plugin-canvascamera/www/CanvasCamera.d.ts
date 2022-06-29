declare global {
    interface Window {
        Ionic?: any;
        plugin: {
            CanvasCamera: CanvasCameraConstructor;
        };
        CanvasCamera: CanvasCameraConstructor;
    }
    var CanvasCamera: CanvasCameraConstructor;
}
export declare type CanvasCameraUISize = CanvasCameraCanvasSize;
export declare type CanvasCameraUseImageAs = 'data' | 'file';
export declare type CanvasCameraCameraFacing = 'front' | 'back';
export declare type CanvasCameraPluginCallback = <D>(data: D) => void;
export declare type CanvasCameraPluginResultCallbackFunction = (data: CanvasCameraData) => void;
export declare type CanvasCameraEventMethodName = 'beforeFrameRendering' | 'afterFrameRendering' | 'beforeFrameInitialization' | 'afterFrameInitialization' | 'beforeRenderingPresets' | 'afterRenderingPresets';
export declare type CanvasCameraEventName = Lowercase<CanvasCameraEventMethodName>;
export interface CanvasCameraCanvasElements {
    fullsize: HTMLCanvasElement;
    thumbnail?: HTMLCanvasElement;
}
export interface CanvasCameraRenderers {
    fullsize: CanvasCameraRenderer;
    thumbnail?: CanvasCameraRenderer;
    [key: string]: CanvasCameraRenderer | undefined;
}
export interface CanvasCameraEventDetail {
    context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame;
    data: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame;
}
export interface CanvasCameraUserOptions {
    width?: number;
    height?: number;
    cameraFacing?: CanvasCameraCameraFacing;
    canvas?: {
        width?: number;
        height?: number;
    };
    capture?: {
        width?: number;
        height?: number;
    };
    use?: CanvasCameraUseImageAs;
    fps?: number;
    flashMode?: boolean;
    hasThumbnail?: boolean;
    thumbnailRatio?: number;
    onAfterDraw?: <F>(frame: F) => void;
    onBeforeDraw?: <F>(frame: F) => void;
}
export interface CanvasCameraDataImages {
    orientation?: CanvasCameraOrientation;
    fullsize?: CanvasCameraDataImage;
    thumbnail: CanvasCameraDataImage;
}
export interface CanvasCameraDataOutput {
    images?: CanvasCameraDataImages;
}
export interface CanvasCameraCaptureId {
    id?: number;
}
export interface CanvasCameraCaptureFps {
    min?: number;
    max?: number;
}
export interface CanvasCameraCaptureSettings {
    width?: number;
    height?: number;
    format?: number;
    started?: boolean;
    focusMode?: string;
    fps?: CanvasCameraCaptureFps | number;
    camera?: CanvasCameraCaptureId;
}
export interface CanvasCameraData {
    message?: string;
    options?: CanvasCameraUserOptions;
    preview?: CanvasCameraCaptureSettings;
    output?: CanvasCameraDataOutput;
}
export default interface CanvasCameraConstructor {
    new (): CanvasCamera;
    instance: CanvasCamera;
    getInstance(): CanvasCamera;
    beforeFrameRendering(listener: CanvasCameraRendererEventListener): CanvasCamera;
    afterFrameRendering(listener: CanvasCameraRendererEventListener): CanvasCamera;
    beforeFrameInitialization(listener: CanvasCameraFrameEventListener): CanvasCamera;
    afterFrameInitialization(listener: CanvasCameraFrameEventListener): CanvasCamera;
    beforeRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
    afterRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
    initialize(fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements, tcanvas?: HTMLCanvasElement): CanvasCamera;
    start(userOptions: CanvasCameraUserOptions, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    stop(onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    flashMode(flashMode: boolean, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    cameraPosition(cameraFacing: CanvasCameraCameraFacing, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
}
export interface CanvasCamera {
    onCapture: CanvasCameraPluginCallback | undefined;
    nativeClass: string;
    canvas: CanvasCameraRenderers;
    options: CanvasCameraUserOptions;
    beforeFrameRendering(listener: CanvasCameraRendererEventListener): CanvasCamera;
    afterFrameRendering(listener: CanvasCameraRendererEventListener): CanvasCamera;
    beforeFrameInitialization(listener: CanvasCameraFrameEventListener): CanvasCamera;
    afterFrameInitialization(listener: CanvasCameraFrameEventListener): CanvasCamera;
    beforeRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
    afterRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
    dispatch(this: CanvasCamera, eventName: CanvasCameraEventName, context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame, data?: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame): CanvasCamera;
    initialize(fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements, tcanvas?: HTMLCanvasElement): CanvasCamera;
    start(userOptions: CanvasCameraUserOptions, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    stop(onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    flashMode(flashMode: boolean, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    cameraPosition(cameraFacing: CanvasCameraCameraFacing, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): CanvasCamera;
    capture(data: CanvasCameraData): CanvasCamera;
    createFrame(image: HTMLImageElement, element: HTMLCanvasElement, renderer: CanvasCameraRenderer): CanvasCameraFrame;
    createRenderer(element: HTMLCanvasElement, canvasCamera: CanvasCamera): CanvasCameraRenderer;
    enableRenderers(): CanvasCamera;
    disableRenderers(): CanvasCamera;
    setRenderingPresets(): CanvasCamera;
    getUISize(): CanvasCameraCanvasSize;
    getUIOrientation(): CanvasCameraOrientation;
    setRenderersSize(size: CanvasCameraCanvasSize): CanvasCamera;
}
export declare type CanvasCameraOrientation = 'portrait' | 'landscape';
export declare type CanvasCameraEvent = CustomEvent<CanvasCameraEventDetail>;
export declare type CanvasCameraEventListener = (this: CanvasCamera, event: CanvasCameraEvent) => void;
export declare type CanvasCameraFrameEventListener = (this: CanvasCameraFrame, event: CanvasCameraEvent) => void;
export declare type CanvasCameraRendererEventListener = (this: CanvasCameraRenderer, event: CanvasCameraEvent, frame: CanvasCameraFrame) => void;
export interface CanvasCameraCanvasSize {
    height: number;
    width: number;
    auto?: boolean;
}
export interface CanvasCameraDataImage {
    data?: string;
    file?: string;
    path?: string;
    rotation?: number;
    orientation?: CanvasCameraOrientation;
    timestamp?: number;
}
export interface CanvasCameraRendererConstructor {
    new (element: HTMLCanvasElement, canvasCamera: CanvasCamera): CanvasCameraRenderer;
}
export interface CanvasCameraRenderer {
    data: CanvasCameraDataImage | undefined;
    size: CanvasCameraCanvasSize | undefined;
    image: HTMLImageElement | undefined;
    context: CanvasRenderingContext2D | undefined | null;
    orientation: CanvasCameraOrientation | undefined;
    buffer: CanvasCameraDataImage[];
    available: boolean;
    fullscreen: boolean;
    element: HTMLCanvasElement;
    canvasCamera: CanvasCamera;
    onAfterDraw: CanvasCameraPluginCallback | undefined;
    onBeforeDraw: CanvasCameraPluginCallback | undefined;
    initialize(): CanvasCameraRenderer;
    onOrientationChange(): void;
    clear(): CanvasCameraRenderer;
    draw(frame: CanvasCameraFrame): CanvasCameraRenderer;
    bufferize(data: CanvasCameraDataImage): CanvasCameraRenderer;
    run(): CanvasCameraRenderer;
    render(data: CanvasCameraDataImage): CanvasCameraRenderer;
    enable(): CanvasCameraRenderer;
    disable(): CanvasCameraRenderer;
    enabled(): boolean;
    disabled(): boolean;
    invert(): CanvasCameraRenderer;
    resize(): CanvasCameraRenderer;
    setSize(size: CanvasCameraCanvasSize, auto?: boolean): CanvasCameraRenderer;
    setOnBeforeDraw(onBeforeDraw: CanvasCameraPluginCallback): CanvasCameraRenderer;
    setOnAfterDraw(onAfterDraw: CanvasCameraPluginCallback): CanvasCameraRenderer;
}
export interface CanvasCameraFrameConstructor {
    new (image: HTMLImageElement, element: HTMLCanvasElement, renderer: CanvasCameraRenderer): CanvasCameraFrame;
}
export interface CanvasCameraFrame {
    ratio: number;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
    renderer: CanvasCameraRenderer;
    image: HTMLImageElement;
    element: HTMLCanvasElement;
    initialize(): CanvasCameraFrame;
    recycle(): CanvasCameraFrame;
}
//# sourceMappingURL=CanvasCamera.d.ts.map