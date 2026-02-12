"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sphere, Stars, Html } from "@react-three/drei";
import { useControls, folder } from "leva";
import * as THREE from "three";

const PERIODIC_TABLE: Record<number, [string, string, number]> = {
    1: ["Hydrogen", "H", 0], 2: ["Helium", "He", 2], 3: ["Lithium", "Li", 4], 4: ["Beryllium", "Be", 5], 5: ["Boron", "B", 6], 6: ["Carbon", "C", 6], 7: ["Nitrogen", "N", 7], 8: ["Oxygen", "O", 8], 9: ["Fluorine", "F", 10], 10: ["Neon", "Ne", 10],
    11: ["Sodium", "Na", 12], 12: ["Magnesium", "Mg", 12], 13: ["Aluminum", "Al", 14], 14: ["Silicon", "Si", 14], 15: ["Phosphorus", "P", 16], 16: ["Sulfur", "S", 16], 17: ["Chlorine", "Cl", 18], 18: ["Argon", "Ar", 22], 19: ["Potassium", "K", 20], 20: ["Calcium", "Ca", 20],
    21: ["Scandium", "Sc", 24], 22: ["Titanium", "Ti", 26], 23: ["Vanadium", "V", 28], 24: ["Chromium", "Cr", 28], 25: ["Manganese", "Mn", 30], 26: ["Iron", "Fe", 30], 27: ["Cobalt", "Co", 32], 28: ["Nickel", "Ni", 31], 29: ["Copper", "Cu", 35], 30: ["Zinc", "Zn", 35],
    31: ["Gallium", "Ga", 39], 32: ["Germanium", "Ge", 41], 33: ["Arsenic", "As", 42], 34: ["Selenium", "Se", 45], 35: ["Bromine", "Br", 45], 36: ["Krypton", "Kr", 48], 37: ["Rubidium", "Rb", 48], 38: ["Strontium", "Sr", 50], 39: ["Yttrium", "Y", 50], 40: ["Zirconium", "Zr", 51],
    41: ["Niobium", "Nb", 52], 42: ["Molybdenum", "Mo", 54], 43: ["Technetium", "Tc", 55], 44: ["Ruthenium", "Ru", 57], 45: ["Rhodium", "Rh", 58], 46: ["Palladium", "Pd", 60], 47: ["Silver", "Ag", 61], 48: ["Cadmium", "Cd", 66], 49: ["Indium", "In", 66], 50: ["Tin", "Sn", 69],
    51: ["Antimony", "Sb", 71], 52: ["Tellurium", "Te", 76], 53: ["Iodine", "I", 74], 54: ["Xenon", "Xe", 77], 55: ["Cesium", "Cs", 78], 56: ["Barium", "Ba", 81], 57: ["Lanthanum", "La", 82], 58: ["Cerium", "Ce", 82], 59: ["Praseodymium", "Pr", 82], 60: ["Neodymium", "Nd", 84],
    61: ["Promethium", "Pm", 84], 62: ["Samarium", "Sm", 88], 63: ["Europium", "Eu", 89], 64: ["Gadolinium", "Gd", 93], 65: ["Terbium", "Tb", 94], 66: ["Dysprosium", "Dy", 97], 67: ["Holmium", "Ho", 98], 68: ["Erbium", "Er", 99], 69: ["Thulium", "Tm", 100], 70: ["Ytterbium", "Yb", 103],
    71: ["Lutetium", "Lu", 104], 72: ["Hafnium", "Hf", 106], 73: ["Tantalum", "Ta", 108], 74: ["Tungsten", "W", 110], 75: ["Rhenium", "Re", 111], 76: ["Osmium", "Os", 114], 77: ["Iridium", "Ir", 115], 78: ["Platinum", "Pt", 117], 79: ["Gold", "Au", 118], 80: ["Mercury", "Hg", 121],
    81: ["Thallium", "Tl", 123], 82: ["Lead", "Pb", 125], 83: ["Bismuth", "Bi", 126], 84: ["Polonium", "Po", 125], 85: ["Astatine", "At", 125], 86: ["Radon", "Rn", 136], 87: ["Francium", "Fr", 136], 88: ["Radium", "Ra", 138], 89: ["Actinium", "Ac", 138], 90: ["Thorium", "Th", 142],
    91: ["Protactinium", "Pa", 140], 92: ["Uranium", "U", 146], 93: ["Neptunium", "Np", 144], 94: ["Plutonium", "Pu", 150], 95: ["Americium", "Am", 148], 96: ["Curium", "Cm", 151], 97: ["Berkelium", "Bk", 150], 98: ["Californium", "Cf", 153], 99: ["Einsteinium", "Es", 153], 100: ["Fermium", "Fm", 157],
    101: ["Mendelevium", "Md", 157], 102: ["Nobelium", "No", 157], 103: ["Lawrencium", "Lr", 159], 104: ["Rutherfordium", "Rf", 157], 105: ["Dubnium", "Db", 157], 106: ["Seaborgium", "Sg", 163], 107: ["Bohrium", "Bh", 163], 108: ["Hassium", "Hs", 161], 109: ["Meitnerium", "Mt", 167], 110: ["Darmstadtium", "Ds", 171],
    111: ["Roentgenium", "Rg", 171], 112: ["Copernicium", "Cn", 173], 113: ["Nihonium", "Nh", 171], 114: ["Flerovium", "Fl", 175], 115: ["Moscovium", "Mc", 175], 116: ["Livermorium", "Lv", 177], 117: ["Tennessine", "Ts", 177], 118: ["Oganesson", "Og", 176],
};

function MovingCamera({ sensitivity, X, Y, Z }: any) {
    const { camera } = useThree();
    useFrame((state) => {
        const { x, y } = state.pointer;
        const targetPosition = new THREE.Vector3((x * sensitivity) + X, (y * sensitivity) + Y, Z);
        camera.position.lerp(targetPosition, 0.05);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function Scene() {
    const [{ stableAtoms, protons, neutrons, electrons, sensitivity, X, Y, Z }, set] = useControls(() => ({
        "Atomic State": folder({
            stableAtoms: { value: true, label: "Stable Atoms Only" },
            protons: { value: 1, min: 1, max: 118, step: 1 },
            neutrons: { value: 0, min: 0, max: 180, step: 1 },
            electrons: { value: 1, min: 0, max: 118, step: 1 },
        }),
        "Visuals": folder({
            sensitivity: { value: 5, min: 0.1, max: 100 },
            X: { value: 0, min: -5, max: 450 },
            Y: { value: 0, min: -5, max: 220 },
            Z: { value: 18, min: 5, max: 220 },
        })
    }));

    useEffect(() => {
        if (stableAtoms) {
            const entry = PERIODIC_TABLE[protons];
            if (entry) {
                set({ neutrons: entry[2], electrons: protons });
            }
        }
    }, [protons, stableAtoms, set]);

    const entry = PERIODIC_TABLE[protons];
    const name = entry ? entry[0] : "Unknown";
    const symbol = entry ? entry[1] : "??";
    const charge = protons - electrons;
    const ionSuffix = charge === 0 ? "" : charge > 0 ? `${charge}+` : `${Math.abs(charge)}-`;

    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#020617" }}>

            {/* 1. FIXED 2D OVERLAY (Top-Left Label) */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none select-none">
                <div className="text-white bg-slate-900/90 p-6 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl min-w-[280px]">
                    <div className="flex justify-between items-start">
                        <h2 className="text-6xl font-black text-cyan-400 leading-none">
                            {symbol}<sup className="text-xl align-top ml-1">{ionSuffix}</sup>
                        </h2>
                        <span className="text-[10px] font-mono bg-cyan-500/20 px-2 py-1 rounded text-cyan-300 border border-cyan-500/30">
                            {stableAtoms ? "QUANTIZED" : "FREEFORM"}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mt-4 uppercase tracking-widest border-b border-white/10 pb-2">
                        {name}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mt-4 font-mono text-center text-[10px]">
                        <div className="bg-red-500/20 p-2 rounded border border-red-500/30 text-red-300">P: {protons}</div>
                        <div className="bg-blue-500/20 p-2 rounded border border-blue-500/30 text-blue-300">N: {neutrons}</div>
                        <div className="bg-yellow-500/20 p-2 rounded border border-yellow-500/30 text-yellow-300">E: {electrons}</div>
                    </div>
                </div>
            </div>

            {/* 2. THE 3D SCENE */}
            <Canvas camera={{ position: [0, 0, 18], fov: 75 }}>
                <MovingCamera sensitivity={sensitivity} X={X} Y={Y} Z={Z} />
                <Stars radius={150} depth={50} count={5000} factor={4} />

                {/* Nucleus with Volume Filling and Shuffling */}
                <group>
                    {useMemo(() => {
                        const totalNucleons = protons + neutrons;
                        if (totalNucleons === 0) return null;

                        const particles = [
                            ...Array(protons).fill({ color: "#ff3333", emissive: "#ff0000" }),
                            ...Array(neutrons).fill({ color: "#4b5563", emissive: "#000000" })
                        ].sort(() => Math.random() - 0.5);

                        const maxRadius = Math.max(0.6, Math.pow(totalNucleons, 1 / 3) * 0.35);

                        return particles.map((p, i) => {
                            const r = maxRadius * Math.pow(Math.random(), 1 / 3);
                            const theta = Math.random() * 2 * Math.PI;
                            const phi = Math.acos(2 * Math.random() - 1);

                            return (
                                <Sphere key={i} args={[0.22, 16, 16]} position={[
                                    r * Math.sin(phi) * Math.cos(theta),
                                    r * Math.sin(phi) * Math.sin(theta),
                                    r * Math.cos(phi)
                                ]}>
                                    <meshStandardMaterial
                                        color={p.color}
                                        emissive={p.emissive}
                                        emissiveIntensity={0.3}
                                        roughness={0.4}
                                    />
                                </Sphere>
                            );
                        });
                    }, [protons, neutrons])}
                </group>

                {/* Electron Shells */}
                <group>
                    {Array.from({ length: electrons }).map((_, i) => {
                        const shell = i < 2 ? 1 : i < 10 ? 2 : i < 28 ? 3 : i < 60 ? 4 : i < 92 ? 5 : 6;
                        const radius = shell * 3.5;
                        return <Electron key={`e-${i}`} index={i} radius={radius} speed={4 / radius} />;
                    })}
                </group>

                <Environment preset="night" />
            </Canvas>
        </div>
    );
}

function Electron({ index, radius, speed }: any) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime() * speed;
        const angle = t + (index * 1.5);
        ref.current.position.set(
            Math.sin(angle) * radius,
            Math.sin(t * 0.3 + index) * (radius * 0.1),
            Math.cos(angle) * radius
        );
    });

    return (
        <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.005, 16, 100]} />
                <meshBasicMaterial color="cyan" opacity={0.08} transparent />
            </mesh>
            <Sphere ref={ref} args={[0.12, 16, 16]}>
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
            </Sphere>
        </group>
    );
}