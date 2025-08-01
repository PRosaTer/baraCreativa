import React from "react";
import Image from "next/image";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
} from "react-share";

interface BadgeCATProps {
    estaDesbloqueado: boolean;
    mensaje: string;
}

const shareUrl = "https://www.baracreativahn.com";
const shareText =
    "Logro desbloqueado! Gracias a mi esfuerzo les comparto el logro desbloqueado y la pagina de www.baracreativahn.com";

export default function BadgeCAT({ estaDesbloqueado, mensaje }: BadgeCATProps) {
    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transition-transform transform hover:scale-105 duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                Insignia CAT
            </h3>
            <div className="relative w-40 h-40">
                <Image
                    src="/badge.cat.png"
                    alt="Insignia CAT"
                    width={160}
                    height={160}
                    className={`transition-all duration-500 ${!estaDesbloqueado ? "grayscale opacity-50" : ""
                        }`}
                />
                {!estaDesbloqueado && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-sm font-bold bg-black bg-opacity-70 px-4 py-2 rounded-full">
                            Bloqueado
                        </span>
                    </div>
                )}
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                {mensaje}
            </p>

            {estaDesbloqueado && (
                <div className="mt-6 w-full text-center">
                    <p className="font-semibold text-gray-700 mb-3">
                        ¡Comparte tu logro!
                    </p>
                    <div className="flex justify-center gap-3">
                        <FacebookShareButton url={shareUrl} title={shareText}>
                            <FacebookIcon size={40} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={shareText}>
                            <TwitterIcon size={40} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={shareUrl} title={shareText}>
                            <WhatsappIcon size={40} round />
                        </WhatsappShareButton>
                        <LinkedinShareButton url={shareUrl} title={shareText}>
                            <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                    </div>
                </div>
            )}
        </div>
    );
}