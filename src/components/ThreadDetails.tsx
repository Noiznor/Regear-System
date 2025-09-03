import React from 'react';
import { ArrowLeft, Calendar, Users, Package, Edit, Shield, Sword, Heart, Star } from 'lucide-react';
import { Thread } from '../types';
import { calculateItemTotals } from '../utils/itemCalculator';

interface ThreadDetailsProps {
  thread: Thread;
  onBack: () => void;
  onEdit: () => void;
}

export const ThreadDetails: React.FC<ThreadDetailsProps> = ({ thread, onBack, onEdit }) => {
  const itemTotals = calculateItemTotals(thread);

  const roleConfig = {
    tank: { 
      icon: Shield, 
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800'
    },
    dps: { 
      icon: Sword, 
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800'
    },
    support: { 
      icon: Star, 
      gradient: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800'
    },
    healer: { 
      icon: Heart, 
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800'
    }
  };

  const totalPlayers = Object.values(thread.roles).reduce((sum, players) => sum + players.length, 0);
  const totalItems = Object.values(itemTotals).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-semibold">Back to Threads</span>
          </button>
          
          <button
            onClick={onEdit}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit Thread
          </button>
        </div>

        {/* Thread Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center shadow-2xl">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Regear Thread Details
            </h1>
            <div className="text-2xl font-semibold text-blue-600 mb-2">
              {new Date(thread.utcDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {new Date(thread.utcDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
            <p className="text-sm text-gray-500">
              Last modified: {thread.lastModified.toLocaleDateString()}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{totalPlayers}</span>
              </div>
              <div className="text-blue-100 text-center font-medium">Total Players</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{totalItems}</span>
              </div>
              <div className="text-purple-100 text-center font-medium">Total Items</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{Object.keys(itemTotals).length}</span>
              </div>
              <div className="text-emerald-100 text-center font-medium">Unique Items</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Players by Role */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              Players by Role
            </h2>
            
            <div className="space-y-6">
              {Object.entries(thread.roles).map(([role, players]) => (
                players.length > 0 && (
                  <div key={role} className={`rounded-2xl p-6 border-2 ${roleConfig[role as keyof typeof roleConfig].bg} ${roleConfig[role as keyof typeof roleConfig].border}`}>
                    <div className="flex items-center mb-4">
                      <div className={`bg-gradient-to-br ${roleConfig[role as keyof typeof roleConfig].gradient} rounded-xl p-3 mr-3 shadow-lg`}>
                        {React.createElement(roleConfig[role as keyof typeof roleConfig].icon, { className: "h-5 w-5 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize">{role}</h3>
                        <p className="text-sm text-gray-600">{players.length} player{players.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {players.map((player, index) => (
                        <div key={index} className="bg-white/80 rounded-xl p-4 shadow-sm border border-white/50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-gray-900 text-lg">{player.ign}</span>
                            <div className="flex items-center space-x-2">
                              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                                Tier {player.tier}
                              </span>
                              {(player.tier === 0 || player.tier === 1) && (
                                <span className="bg-orange-200 px-3 py-1 rounded-full text-xs font-bold text-orange-800">
                                  LIMITED
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <strong className="text-gray-700">Weapon:</strong>
                              <div className="text-gray-900 font-medium">{player.selectedGear.weapon || 'None'}</div>
                            </div>
                            
                            {player.selectedGear.offhand && (
                              <div className="bg-gray-50 rounded-lg p-2">
                                <strong className="text-gray-700">Offhand:</strong>
                                <div className="text-gray-900 font-medium">{player.selectedGear.offhand}</div>
                              </div>
                            )}
                            
                            {player.selectedGear.headgear && (
                              <div className="bg-gray-50 rounded-lg p-2">
                                <strong className="text-gray-700">Headgear:</strong>
                                <div className="text-gray-900 font-medium">{player.selectedGear.headgear}</div>
                              </div>
                            )}
                            
                            <div className="bg-gray-50 rounded-lg p-2">
                              <strong className="text-gray-700">Armor:</strong>
                              <div className="text-gray-900 font-medium">{player.selectedGear.armor || 'None'}</div>
                            </div>
                            
                            {player.selectedGear.boots && (
                              <div className="bg-gray-50 rounded-lg p-2">
                                <strong className="text-gray-700">Boots:</strong>
                                <div className="text-gray-900 font-medium">{player.selectedGear.boots}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Required Items Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              Required Items
            </h2>
            
            <div className="space-y-4">
              {Object.keys(itemTotals).length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-2xl p-6 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No items required</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(itemTotals)
                    .sort(([, a], [, b]) => b - a)
                    .map(([item, count], index) => (
                      <div key={item} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-2 mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item}</span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                          {count}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {Object.keys(itemTotals).length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{totalItems}</div>
                    <div className="text-sm text-blue-700 font-medium">Total Items Needed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{Object.keys(itemTotals).length}</div>
                    <div className="text-sm text-blue-700 font-medium">Different Item Types</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};