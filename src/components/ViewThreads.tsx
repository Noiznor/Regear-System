import React from 'react';
import { Calendar, Users, Package, Eye, Shield, Sword, Heart, Star } from 'lucide-react';
import { Thread } from '../types';
import { calculateItemTotals } from '../utils/itemCalculator';

interface ViewThreadsProps {
  threads: Thread[];
  onSelectThread: (thread: Thread) => void;
}

export const ViewThreads: React.FC<ViewThreadsProps> = ({ threads, onSelectThread }) => {
  const roleIcons = {
    tank: Shield,
    dps: Sword,
    support: Star,
    healer: Heart
  };

  const roleColors = {
    tank: 'from-blue-500 to-blue-600',
    dps: 'from-red-500 to-red-600',
    support: 'from-yellow-500 to-yellow-600',
    healer: 'from-green-500 to-green-600'
  };

  if (threads.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl p-8 mx-auto mb-8 w-24 h-24 flex items-center justify-center shadow-lg">
                <Package className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Threads Created Yet</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Start by creating your first regear thread to organize your guild's equipment needs.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <p className="text-blue-800 font-medium">
                  💡 Tip: Use the "Create Thread" button in the navigation to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Saved Regear Threads</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all your saved regear configurations
          </p>
        </div>
        
        <div className="grid gap-8">
          {threads.map(thread => {
            const itemTotals = calculateItemTotals(thread);
            const totalPlayers = Object.values(thread.roles).reduce((sum, players) => sum + players.length, 0);
            const totalItems = Object.values(itemTotals).reduce((sum, count) => sum + count, 0);
            
            return (
              <div key={thread.id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  {/* Thread Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-3 mr-4 shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {new Date(thread.utcDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-lg text-gray-600">
                          {new Date(thread.utcDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short'
                          })}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Last modified: {thread.lastModified.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Role Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {Object.entries(thread.roles).map(([role, players]) => {
                        const Icon = roleIcons[role as keyof typeof roleIcons];
                        const gradient = roleColors[role as keyof typeof roleColors];
                        
                        return (
                          <div key={role} className="text-center">
                            <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 shadow-lg mb-3`}>
                              <Icon className="h-6 w-6 text-white mx-auto mb-2" />
                              <div className="text-white font-bold text-lg">{players.length}</div>
                            </div>
                            <p className="font-semibold text-gray-900 capitalize">{role}</p>
                            <p className="text-sm text-gray-600">players</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <div className="font-bold text-blue-900">{totalPlayers}</div>
                            <div className="text-sm text-blue-700">Total Players</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <div className="font-bold text-purple-900">{totalItems}</div>
                            <div className="text-sm text-purple-700">Total Items</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-emerald-600 mr-2" />
                          <div>
                            <div className="font-bold text-emerald-900">{Object.keys(itemTotals).length}</div>
                            <div className="text-sm text-emerald-700">Unique Items</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col justify-center">
                    <button
                      onClick={() => onSelectThread(thread)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                    >
                      <Eye className="mr-3 h-5 w-5" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Item Preview */}
                {Object.keys(itemTotals).length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Package className="mr-2 h-5 w-5 text-gray-600" />
                      Top Required Items
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(itemTotals)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 8)
                        .map(([item, count]) => (
                          <span key={item} className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl text-sm font-semibold border border-gray-300 shadow-sm">
                            {item}: {count}
                          </span>
                        ))}
                      {Object.keys(itemTotals).length > 8 && (
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-xl text-sm font-semibold border border-blue-300 shadow-sm">
                          +{Object.keys(itemTotals).length - 8} more items...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};