
import { useBabylon } from './hooks/useBbylon';

const { createScene } = useBabylon(canvas)

const canvas = document.getElementById("renderCanvas");

createScene(canvas)