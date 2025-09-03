import React, { useState } from 'react';
import { Calendar, Users, Plus, Save, Trash2, Shield, Sword, Heart, Star } from 'lucide-react';
import { Thread, RoleType, Player, GearPreset } from '../types';
import { getPresetsByRole } from '../data/gearPresets';
import { getTierLimitedGear } from '../utils/itemCalculator';
import { generateId } from '../utils/storage';

interface CreateThreadProps {
  onSaveThread: (thread: Thread) => void;
  existingThread?: Thread;
}

export const CreateThread: React.FC<CreateThreadProps> = ({ onSaveThread, existingThread }) => {
  const [utcDate, setUtcDate] = useState(existingThread?.utcDate || '');
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
  const [thread, setThread] = useState<Thread>(existingThread || {
    id: generateId(),
    utcDate: '',
    roles: { tank: [], dps: [], support: [], healer: [] },
    createdAt: new Date(),
    lastModified: new Date()
  });

  const roleConfig = {
    tank: { 
      color: 'blue', 
      icon: Shield, 
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    dps: { 
      color: 'red', 
      icon: Sword, 
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700'
    },
    support: { 
      color: 'yellow', 
      icon: Star, 
      gradient: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    healer: { 
      color: 'green', 
      icon: Heart, 
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  const selectRole = (role: RoleType) => {
    setCurrentRole(role);
    setPlayerCount(1);
    setCurrentPlayers([]);
  };

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const players: Player[] = Array.from({ length: count }, () => ({
      ign: '',
      tier: 8,
      selectedGear: { weapon: '', headgear: '', armor: '', boots: '' }
    }));
    setCurrentPlayers(players);
  };

  const updatePlayer = (index: number, field: keyof Player, value: any) => {
    const updated = [...currentPlayers];
    if (field === 'selectedGear') {
      const tierLimitedGear = getTierLimitedGear(value, updated[index].tier);
      updated[index] = { ...updated[index], [field]: tierLimitedGear };
    } else {
      updated[index] = { ...updated[index], [field]: value };
      
      if (field === 'tier') {
        const tierLimitedGear = getTierLimitedGear(updated[index].selectedGear, value);
        updated[index].selectedGear = tierLimitedGear;
      }
    }
    setCurrentPlayers(updated);
  };

  const confirmPlayers = () => {
    if (currentRole && currentPlayers.every(p => p.ign.trim())) {
      setThread(prev => ({
        ...prev,
        utcDate,
        roles: {
          ...prev.roles,
          [currentRole]: [...prev.roles[currentRole], ...currentPlayers]
        },
        lastModified: new Date()
      }));
      setCurrentPlayers([]);
      setCurrentRole(null);
      setPlayerCount(1);
    }
  };

  const removePlayer = (role: RoleType, index: number) => {
    setThread(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: prev.roles[role].filter((_, i) => i !== index)
      },
      lastModified: new Date()
    }));
  };

  const saveThread = () => {
    if (utcDate && Object.values(thread.roles).some(players => players.length > 0)) {
      onSaveThread({ ...thread, utcDate });
      setThread({
        id: generateId(),
        utcDate: '',
        roles: { tank: [], dps: [], support: [], healer: [] },
        createdAt: new Date(),
        lastModified: new Date()
      });
      setUtcDate('');
      setCurrentPlayers([]);
      setCurrentRole(null);
      setPlayerCount(1);
    }
  };

  const presets = currentRole ? getPresetsByRole(currentRole) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {existingThread ? 'Modify Thread' : 'Create New Regear Thread'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure player roles and gear presets for your regear operation
          </p>
        </div>

        {/* UTC Date Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
              <p className="text-gray-600">Set the UTC date and time for this regear thread</p>
            </div>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              UTC Date & Time
            </label>
            <input
              type="datetime-local"
              value={utcDate}
              onChange={(e) => setUtcDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        {!currentRole && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Select Role to Add</h2>
              <p className="text-gray-600">Choose which role you want to configure players for</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['tank', 'dps', 'support', 'healer'] as RoleType[]).map(role => {
                const config = roleConfig[role];
                const Icon = config.icon;
                
                return (
                  <button
                    key={role}
                    onClick={() => selectRole(role)}
                    className="group relative overflow-hidden bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`bg-gradient-to-br ${config.gradient} rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{role}</h3>
                      <p className="text-sm text-gray-600">
                        {role === 'tank' && 'Frontline defenders with heavy armor'}
                        {role === 'dps' && 'High damage dealers and damage output'}
                        {role === 'support' && 'Utility and team enhancement'}
                        {role === 'healer' && 'Team restoration and healing'}
                      </p>
                      <div className="mt-4 text-xs text-gray-500">
                        {thread.roles[role].length} players added
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Count Selection */}
        {currentRole && currentPlayers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className={`bg-gradient-to-br ${roleConfig[currentRole].gradient} rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg`}>
                {React.createElement(roleConfig[currentRole].icon, { className: "h-8 w-8 text-white" })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 capitalize">
                Adding {currentRole} Players
              </h2>
              <p className="text-gray-600">How many {currentRole} players do you want to add?</p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Number of Players
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(Number(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-center text-lg font-semibold"
                />
                <button
                  onClick={() => handlePlayerCountChange(playerCount)}
                  disabled={playerCount < 1}
                  className={`px-8 py-3 ${roleConfig[currentRole].button} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105`}
                >
                  Continue
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentRole(null)}
                className="px-6 py-2 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back to Role Selection
              </button>
            </div>
          </div>
        )}

        {/* Player Configuration */}
        {currentRole && currentPlayers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className={`bg-gradient-to-br ${roleConfig[currentRole].gradient} rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg`}>
                {React.createElement(roleConfig[currentRole].icon, { className: "h-8 w-8 text-white" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 capitalize">
                Configure {currentRole} Players
              </h3>
              <p className="text-gray-600">Set up each player's IGN, tier, and gear preset</p>
            </div>
            
            <div className="space-y-6">
              {currentPlayers.map((player, index) => (
                <div key={index} className={`${roleConfig[currentRole].bg} rounded-2xl p-6 border-2 ${roleConfig[currentRole].border}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-gray-900">
                      Player {index + 1}
                    </h4>
                    <div className={`px-3 py-1 ${roleConfig[currentRole].button} text-white rounded-full text-sm font-semibold shadow-md`}>
                      {currentRole.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IGN (In-Game Name)
                      </label>
                      <input
                        type="text"
                        value={player.ign}
                        onChange={(e) => updatePlayer(index, 'ign', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter player name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Player Tier
                      </label>
                      <select
                        value={player.tier}
                        onChange={(e) => updatePlayer(index, 'tier', Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      >
                        {Array.from({ length: 9 }, (_, i) => (
                          <option key={i} value={i}>Tier {i}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gear Preset
                      </label>
                      <select
                        onChange={(e) => {
                          const preset = presets[e.target.value];
                          if (preset) {
                            updatePlayer(index, 'selectedGear', preset);
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select preset...</option>
                        {Object.keys(presets).map(presetName => (
                          <option key={presetName} value={presetName}>
                            {presetName}
                          </option>
                        ))}
                        <option value="custom">Custom Gear</option>
                      </select>
                    </div>
                  </div>

                  {(player.tier === 0 || player.tier === 1) && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center">
                        <div className="bg-orange-500 rounded-full p-2 mr-3">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-orange-800">Tier {player.tier} Limitation Active</p>
                          <p className="text-sm text-orange-700">Only Weapon and Armor will be included in regear</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Weapon</label>
                      <input
                        type="text"
                        value={player.selectedGear.weapon}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          weapon: e.target.value
                        })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Weapon name"
                      />
                    </div>
                    
                    {player.selectedGear.offhand !== undefined && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Offhand</label>
                        <input
                          type="text"
                          value={player.selectedGear.offhand || ''}
                          onChange={(e) => updatePlayer(index, 'selectedGear', {
                            ...player.selectedGear,
                            offhand: e.target.value
                          })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Offhand item"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Headgear {(player.tier === 0 || player.tier === 1) && '(Tier Limited)'}
                      </label>
                      <input
                        type="text"
                        value={(player.tier === 0 || player.tier === 1) ? '' : player.selectedGear.headgear}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          headgear: e.target.value
                        })}
                        disabled={player.tier === 0 || player.tier === 1}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 transition-all duration-200"
                        placeholder={player.tier === 0 || player.tier === 1 ? "Not available for this tier" : "Headgear name"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Armor</label>
                      <input
                        type="text"
                        value={player.selectedGear.armor}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          armor: e.target.value
                        })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Armor name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Boots {(player.tier === 0 || player.tier === 1) && '(Tier Limited)'}
                      </label>
                      <input
                        type="text"
                        value={(player.tier === 0 || player.tier === 1) ? '' : player.selectedGear.boots}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          boots: e.target.value
                        })}
                        disabled={player.tier === 0 || player.tier === 1}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 transition-all duration-200"
                        placeholder={player.tier === 0 || player.tier === 1 ? "Not available for this tier" : "Boots name"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => {
                  setCurrentPlayers([]);
                  setCurrentRole(null);
                  setPlayerCount(1);
                }}
                className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmPlayers}
                disabled={!currentPlayers.every(p => p.ign.trim())}
                className={`px-8 py-3 ${roleConfig[currentRole].button} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center`}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add {currentPlayers.length} Player{currentPlayers.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Thread Summary */}
        {Object.entries(thread.roles).some(([_, players]) => players.length > 0) && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Thread Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.entries(thread.roles).map(([role, players]) => (
                players.length > 0 && (
                  <div key={role} className={`rounded-2xl p-6 border-2 ${roleConfig[role as RoleType].bg} ${roleConfig[role as RoleType].border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-br ${roleConfig[role as RoleType].gradient} rounded-full p-2`}>
                        {React.createElement(roleConfig[role as RoleType].icon, { className: "h-5 w-5 text-white" })}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{players.length} players</span>
                    </div>
                    
                    <h4 className="font-bold capitalize mb-3 text-gray-900">{role}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {players.map((player, index) => (
                        <div key={index} className="flex justify-between items-center bg-white/70 rounded-lg p-2">
                          <div>
                            <span className="font-medium text-sm">{player.ign}</span>
                            <span className="text-xs text-gray-600 ml-2">(T{player.tier})</span>
                          </div>
                          <button
                            onClick={() => removePlayer(role as RoleType, index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentRole(null)}
                className="px-8 py-3 text-blue-600 border-2 border-blue-300 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add More Roles
              </button>
              
              <button
                onClick={saveThread}
                disabled={!utcDate || !Object.values(thread.roles).some(players => players.length > 0)}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Thread
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};