import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import * as process from "process";

// Polyfill for simple-peer
window.global = window;
window.process = process;
window.Buffer = [];

const socket = io("http://localhost:3001");

const VideoCall = () => {
    const { roomId } = useParams(); // Using roomId as the unique identifier for the call
    const navigate = useNavigate();

    // State
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        }).catch(err => console.error("Error accessing media devices:", err));
    }, []);

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("call-user", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name,
            });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        socket.on("call-accepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("answer-call", { signal: data, to: caller });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        navigate('/appointments'); // Redirect back
    };

    useEffect(() => {
        socket.on("me", (id) => {
            setMe(id);
            // Auto join room from params
            if (roomId) {
                socket.emit("join-room", roomId);
            }
        });

        socket.on("call-user", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });

        socket.on("user-connected", (userId) => {
            console.log("User connected:", userId);
            callUser(userId);
        });

        // Clean up
        return () => {
            socket.off("me");
            socket.off("call-user");
            socket.off("user-connected");
        }
    }, [roomId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-8">Consulta Virtual</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* My Video */}
                <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700 relative h-64 md:h-80">
                    <div className="absolute top-2 left-2 bg-gray-800 px-2 py-1 rounded text-sm z-10">Tú</div>
                    {stream && (
                        <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                    )}
                </div>

                {/* User Video */}
                <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700 relative h-64 md:h-80 flex items-center justify-center">
                    {callAccepted && !callEnded ? (
                        <>
                            <div className="absolute top-2 left-2 bg-gray-800 px-2 py-1 rounded text-sm z-10">Doctor/Paciente</div>
                            <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                        </>
                    ) : (
                        <div className="text-center text-gray-400">
                            <p className="mb-2">Esperando ...</p>
                            {receivingCall && !callAccepted && (
                                <div className="mt-4">
                                    <p className="text-white font-bold mb-2">{name || "Alguien"} está llamando...</p>
                                    <button
                                        onClick={answerCall}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded animate-pulse"
                                    >
                                        Contestar
                                    </button>
                                </div>
                            )}
                            {/* Status Info */}
                            {!receivingCall && !callAccepted && (
                                <div className="mt-4 text-xs text-gray-500">
                                    Conectado a la sala
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex gap-4">
                {/* For testing/demo purposes, we might need a way to trigger call if we rely on IDs. 
                     In a real doctor-patient scenario, usually the doctor calls or they join a room and it auto-connects. 
                     Here we implemented call-user based on specific socket ID. 
                     To make it easier, we can adapt to "Room" based auto-call or list users in room.
                     For now, let's keep it simple: If someone calls, you answer. 
                  */}

                {callAccepted && !callEnded ? (
                    <button
                        onClick={leaveCall}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2"
                    >
                        <span className="text-xl">📞</span> Finalizar Llamada
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/appointments')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                    >
                        Volver
                    </button>
                )}
            </div>

            {/* Debug Info removed - Auto connection enabled */}

        </div>
    );
};

export default VideoCall;
